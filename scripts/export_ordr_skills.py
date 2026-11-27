"""Export the English character skill index from an ORDR Warcraft III map."""

from __future__ import annotations

import argparse
from collections import defaultdict
import bz2
import html
import json
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
import re
import struct
import sys
import tempfile
import zlib


RARITIES = (
    "Rare", "Legend", "Hidden", "Transcendence", "Immortal", "Eternal",
    "Mystery", "Random Only", "Restriction", "Distortion", "Change", "Seraphim",
)
EXCLUDED_RARITIES = {"Common", "Uncommon", "Special", "Five Elders"}
SKILL_EXCLUSION_ID = {"A0B9", "A07Y","A10P","A12S","A080","A0BA","A17T"}
SKILL_EXCLUSION = re.compile(r"\b(?:Combination|Sale|Sell|Selling)\b", re.I)
WAREHOUSE_SKILL = re.compile(r"move\s+to\s+warehouse(?:\s*\(G\))?", re.I)
MAP_COLOR = re.compile(r"\|c[0-9a-f]{8}|\|r", re.I)
MAP_NEWLINE = re.compile(r"\|n", re.I)
WTS_REFERENCE = re.compile(r"TRIGSTR_(\d+)")
WTS_ENTRY = re.compile(
    r"^\s*STRING[ \t]+(\d+)[^\n]*\n"
    r"(?:[ \t]*(?://[^\n]*)?\n)*"
    r"[ \t]*\{[ \t]*\n(.*?)^[ \t]*\}[ \t]*$",
    re.M | re.S,
)
MPQ_HEADER = struct.Struct("<4sIIHHIIII")
MPQ_ROW = struct.Struct("<4I")
UINT32 = 0xFFFFFFFF
FILE_EXISTS = 0x80000000
FILE_SINGLE_UNIT = 0x01000000
FILE_ENCRYPTED = 0x00010000
FILE_KEY_ADJUSTED = 0x00020000
FILE_COMPRESSED = 0x00000200
HEADER_SEARCH_BYTES = 1024 * 1024
ADDITIONAL_MEMBERS = {
    "war3map.w3t": "物品",
    "war3map.w3q": "升級",
    "war3map.w3h": "增益與效果",
    "war3map.w3b": "可破壞物件",
    "war3map.w3d": "裝飾物件",
    "war3map.w3e": "地形",
    "war3map.wtg": "觸發器",
    "war3map.j": "JASS 地圖腳本",
    r"Scripts\war3map.j": "JASS 地圖腳本",
    "war3map.lua": "Lua 地圖腳本",
}


class MapFormatError(ValueError):
    """The map contains unsupported, missing, or invalid data."""


@dataclass
class ObjectField:
    code: str
    kind: int
    level: int
    pointer: int
    value: int | float | str


@dataclass
class ObjectRecord:
    is_custom: bool
    base_id: str
    custom_id: str
    fields: list[ObjectField]

    @property
    def identifier(self):
        return self.custom_id if self.is_custom else self.base_id


def make_crypt_table():
    table = [0] * 1280
    seed = 0x100001
    for character in range(256):
        for group in range(5):
            seed = (seed * 125 + 3) % 0x2AAAAB
            high = (seed & 0xFFFF) << 16
            seed = (seed * 125 + 3) % 0x2AAAAB
            table[character + group * 256] = high | (seed & 0xFFFF)
    return table


CRYPT_TABLE = make_crypt_table()


def mpq_hash(name, kind):
    first, second = 0x7FED7FED, 0xEEEEEEEE
    for character in name.upper().encode("ascii"):
        first = CRYPT_TABLE[kind * 256 + character] ^ ((first + second) & UINT32)
        second = (character + first + second + (second << 5) + 3) & UINT32
    return first


def decrypt(data, key):
    result = bytearray(data)
    seed = 0xEEEEEEEE
    for offset in range(0, len(data) - 3, 4):
        seed = (seed + CRYPT_TABLE[1024 + (key & 255)]) & UINT32
        value = struct.unpack_from("<I", data, offset)[0] ^ ((seed + key) & UINT32)
        struct.pack_into("<I", result, offset, value)
        key = ((((~key) << 21) + 0x11111111) | (key >> 11)) & UINT32
        seed = (value + seed + (seed << 5) + 3) & UINT32
    return bytes(result)


def expand_sector(data, expected_size):
    if len(data) == expected_size:
        return data
    if not data:
        raise MapFormatError("Empty MPQ sector")
    try:
        if data[0] == 0x02:
            result = zlib.decompress(data[1:])
        elif data[0] == 0x10:
            result = bz2.decompress(data[1:])
        else:
            raise MapFormatError(f"Unsupported MPQ compression 0x{data[0]:02X}")
    except (zlib.error, OSError, EOFError) as exc:
        raise MapFormatError("Invalid compressed MPQ sector") from exc
    if len(result) != expected_size:
        raise MapFormatError("Unexpected MPQ sector size")
    return result


class MapArchive:
    """Read only the named members needed for this export from a classic MPQ."""

    def __init__(self, stream, base, file_size):
        self.stream = stream
        self.base = base
        self.file_size = file_size
        (
            signature, _, _, version, self.sector_shift, hash_offset,
            block_offset, hash_count, self.block_count,
        ) = MPQ_HEADER.unpack(self.read_at(0, MPQ_HEADER.size))
        if signature != b"MPQ\x1a" or version not in (0, 1):
            raise MapFormatError("Unsupported MPQ header version")
        if not hash_count or not self.block_count:
            raise MapFormatError("Empty MPQ tables")

        classic_offsets = (hash_offset, block_offset)
        if version == 1:
            _, hash_high, block_high = struct.unpack("<QHH", self.read_at(32, 12))
            hash_offset |= hash_high << 32
            block_offset |= block_high << 32
        try:
            self.load_tables(hash_offset, block_offset, hash_count)
        except MapFormatError:
            if classic_offsets == (hash_offset, block_offset):
                raise
            self.load_tables(*classic_offsets, hash_count)

    def read_at(self, offset, size):
        position = self.base + offset
        if position < self.base or size > self.file_size - position:
            raise MapFormatError("MPQ data falls outside the map file")
        self.stream.seek(position)
        data = self.stream.read(size)
        if len(data) != size:
            raise MapFormatError("Incomplete MPQ read")
        return data

    def load_tables(self, hash_offset, block_offset, hash_count):
        hash_data = self.read_at(hash_offset, hash_count * MPQ_ROW.size)
        block_data = self.read_at(block_offset, self.block_count * MPQ_ROW.size)
        self.hashes = decrypt(hash_data, mpq_hash("(hash table)", 3))
        self.blocks = decrypt(block_data, mpq_hash("(block table)", 3))

    def matching_blocks(self, name):
        wanted_a, wanted_b = mpq_hash(name, 1), mpq_hash(name, 2)
        candidates = []
        for a, b, locale_and_platform, block in MPQ_ROW.iter_unpack(self.hashes):
            if (a, b) == (wanted_a, wanted_b) and block < self.block_count:
                locale = locale_and_platform & 0xFFFF
                priority = {0x0409: 0, 0: 1}.get(locale, 2)
                candidates.append((priority, block))
        return dict.fromkeys(block for _, block in sorted(candidates))

    def members(self, name):
        candidates = self.matching_blocks(name)
        if not candidates:
            raise FileNotFoundError(name)
        for block in candidates:
            location, stored_size, real_size, flags = MPQ_ROW.unpack_from(
                self.blocks, block * MPQ_ROW.size
            )
            try:
                if not flags & FILE_EXISTS or not stored_size or not real_size:
                    raise MapFormatError("Invalid MPQ block")
                yield self.read_block(name, location, stored_size, real_size, flags)
            except MapFormatError:
                continue
        raise MapFormatError(f"No readable MPQ member for {name}")

    def read_block(self, name, location, stored_size, real_size, flags):
        data = self.read_at(location, stored_size)
        key = None
        if flags & FILE_ENCRYPTED:
            key = mpq_hash(name.rsplit("\\", 1)[-1], 3)
            if flags & FILE_KEY_ADJUSTED:
                key = ((key + location) ^ real_size) & UINT32

        if flags & FILE_COMPRESSED:
            # Some ORDR maps set SINGLE_UNIT even though an offset table is present.
            if not flags & FILE_SINGLE_UNIT or key is not None:
                sizes = []
                if self.sector_shift <= 23:
                    sizes.append(512 << self.sector_shift)
                # A one-sector file can be decoded using its own size as the sector size.
                sizes.append(real_size)
                for sector_size in dict.fromkeys(sizes):
                    try:
                        return self.read_sectors(data, real_size, sector_size, key)
                    except MapFormatError:
                        continue
            if flags & FILE_SINGLE_UNIT:
                content = decrypt(data, key) if key is not None else data
                return expand_sector(content, real_size)
            raise MapFormatError("Unsupported MPQ sector layout")

        if len(data) != real_size:
            raise MapFormatError("Unsupported MPQ file flags")
        if key is None:
            return data
        if flags & FILE_SINGLE_UNIT:
            return decrypt(data, key)
        if self.sector_shift > 23:
            raise MapFormatError("Invalid MPQ sector size")
        sector_size = 512 << self.sector_shift
        return b"".join(
            decrypt(data[offset:offset + sector_size], (key + index) & UINT32)
            for index, offset in enumerate(range(0, real_size, sector_size))
        )

    @staticmethod
    def read_sectors(data, real_size, sector_size, key):
        count = (real_size + sector_size - 1) // sector_size
        table_size = 4 * (count + 1)
        if table_size >= len(data):
            raise MapFormatError("Missing MPQ sector offsets")

        table = data[:table_size]
        if key is not None:
            table = decrypt(table, (key - 1) & UINT32)
        offsets = struct.unpack(f"<{count + 1}I", table)
        if offsets[0] not in (table_size, table_size + 4) or offsets[-1] > len(data):
            raise MapFormatError("Invalid MPQ sector offsets")

        sectors = []
        for index, (start, end) in enumerate(zip(offsets, offsets[1:])):
            expected_size = min(sector_size, real_size - index * sector_size)
            if not 0 < end - start <= expected_size:
                raise MapFormatError("Invalid MPQ sector length")
            sector = data[start:end]
            if key is not None:
                sector = decrypt(sector, (key + index) & UINT32)
            sectors.append(expand_sector(sector, expected_size))
        return b"".join(sectors)


class BinaryReader:
    def __init__(self, data):
        self.data = data
        self.offset = 0

    def read(self, length):
        end = self.offset + length
        if end > len(self.data):
            raise MapFormatError("Unexpected end of object data")
        value = self.data[self.offset:end]
        self.offset = end
        return value

    def number(self, kind="I"):
        return struct.unpack("<" + kind, self.read(4))[0]

    def code(self):
        return self.read(4).decode("latin-1")

    def string(self):
        end = self.data.find(b"\0", self.offset)
        if end < 0:
            raise MapFormatError("Unterminated map string")
        value = self.read(end - self.offset).decode("utf-8", errors="replace")
        self.read(1)
        return value


def parse_string_table(data):
    text = data.decode("utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")
    strings = {int(index): body.rstrip("\n") for index, body in WTS_ENTRY.findall(text)}
    if text.strip() and not strings:
        raise MapFormatError("Invalid WTS string table")
    return strings


def parse_objects(data, extended):
    reader = BinaryReader(data)
    version = reader.number()
    if version not in (1, 2, 3):
        raise MapFormatError(f"Unsupported object data version {version}")

    records = []
    for is_custom in (False, True):
        count = reader.number()
        if count > (len(data) - reader.offset) // 12:
            raise MapFormatError("Invalid object count")
        for _ in range(count):
            base_id, custom_id = reader.code(), reader.code()
            if version == 3:
                reader.read(reader.number() * 4)
            fields = []
            for _ in range(reader.number()):
                field, kind = reader.code(), reader.number()
                level, pointer = (reader.number(), reader.number()) if extended else (0, 0)
                if kind == 3:
                    value = reader.string()
                elif kind in (0, 1, 2):
                    value = reader.number("i" if kind == 0 else "f")
                else:
                    raise MapFormatError(f"Unsupported object field type {kind}")
                fields.append(ObjectField(field, kind, level, pointer, value))
                reader.read(4)
            records.append(ObjectRecord(is_custom, base_id, custom_id, fields))
    if reader.offset != len(data):
        raise MapFormatError("Trailing bytes in object data")
    return records


def resolve_objects(records, strings):
    objects = {}
    for record in records:
        objects[record.identifier] = {
            (field.code, field.level, field.pointer): (
                resolve_string(field.value, strings) if field.kind == 3 else field.value
            )
            for field in record.fields
        }
    return objects


def resolve_string(value, strings):
    reference = WTS_REFERENCE.fullmatch(value)
    return strings.get(int(reference[1]), value) if reference else value


def parse_map_title(data, strings):
    reader = BinaryReader(data)
    version = reader.number()
    if version not in (18, 25, 28, 31, 32, 33):
        raise MapFormatError(f"Unsupported map info version {version}")
    reader.read(8)
    if version >= 28:
        reader.read(16)
    return visible_text(resolve_string(reader.string(), strings))


def parsed_member(archive, name, parser, default=None):
    errors = []
    try:
        for data in archive.members(name):
            try:
                return parser(data)
            except (MapFormatError, UnicodeError) as exc:
                errors.append(str(exc))
    except FileNotFoundError:
        if default is not None:
            return default
        raise MapFormatError(f"Missing {name}") from None
    except MapFormatError as exc:
        if not errors:
            errors.append(str(exc))
    raise MapFormatError(f"Could not parse {name} ({'; '.join(errors)})")


def readable_members(archive, names):
    found = {}
    for name in names:
        try:
            found[name] = len(next(archive.members(name)))
        except (FileNotFoundError, MapFormatError):
            continue
    return found


def read_map(path, inspect_members=False):
    failures = []
    file_size = path.stat().st_size
    with path.open("rb") as stream:
        prefix = stream.read(HEADER_SEARCH_BYTES)
        for offset in range(0, len(prefix), 512):
            if prefix[offset:offset + 4] != b"MPQ\x1a":
                continue
            try:
                archive = MapArchive(stream, offset, file_size)
                strings = parsed_member(archive, "war3map.wts", parse_string_table, default={})
                units = parsed_member(
                    archive, "war3map.w3u",
                    lambda data: parse_objects(data, extended=False),
                )
                abilities = parsed_member(
                    archive, "war3map.w3a",
                    lambda data: parse_objects(data, extended=True),
                )
                if not units or not abilities:
                    raise MapFormatError("Empty unit or ability table")
            except MapFormatError as exc:
                failures.append(f"0x{offset:X}: {exc}")
                continue

            try:
                title = parsed_member(
                    archive, "war3map.w3i", lambda data: parse_map_title(data, strings),
                )
            except MapFormatError:
                title = path.stem
            additional = readable_members(archive, ADDITIONAL_MEMBERS) if inspect_members else {}
            return title or path.stem, units, abilities, strings, additional
    detail = "; ".join(failures) if failures else "MPQ header not found"
    raise MapFormatError(f"Unable to read map ({detail})")


def visible_text(value):
    value = MAP_COLOR.sub("", html.unescape(value))
    return MAP_NEWLINE.sub("\n", value).strip()


def skill_details(identifier, ability_fields):
    if identifier in SKILL_EXCLUSION_ID:
        return None
    by_level = defaultdict(dict)
    for (field, level, _), value in ability_fields.items():
        if field in {"atp1", "aub1"}:
            cleaned = visible_text(value) if isinstance(value, str) else value
            if cleaned != "":
                by_level[level][field] = cleaned
    titles = [fields.get("atp1", "") for fields in by_level.values()]
    if any(SKILL_EXCLUSION.search(title) for title in titles):
        return None

    described_levels = [
        level for level, fields in by_level.items()
        if "atp1" in fields or "aub1" in fields
    ]
    if not described_levels:
        return None
    highest = by_level[max(described_levels)]
    skill = {}
    if "atp1" in highest:
        skill["name"] = highest["atp1"]
    if "aub1" in highest:
        skill["description"] = highest["aub1"]
    return skill


def build_character(identifier, unit_fields, skills):
    labels = list(dict.fromkeys(
        label for (field, _, _), value in unit_fields.items()
        if field in {"unam", "upro"} and (label := visible_text(value))
    ))
    classified = [
        (label, *label.rsplit(" - ", 1)) for label in labels
        if " - " in label
    ]
    if any(rarity in EXCLUDED_RARITIES for _, _, rarity in classified):
        return None
    selected = next((entry for entry in classified if entry[2] in RARITIES), None)
    if selected is None:
        return None

    label, name, rarity = selected
    character = {"id": identifier, "tmo_id": identifier[::-1], "name": name, "rarity": rarity}
    alternate_names = [other for other in labels if other != label]
    if alternate_names:
        character["alternateNames"] = alternate_names
    linked_ids = dict.fromkeys(
        ability.strip()
        for (field, _, _), group in unit_fields.items() if field in {"uabi", "uhab"}
        for ability in group.split(",") if ability.strip()
    )
    character["skills"] = [skills[ability] for ability in linked_ids if ability in skills]
    return character


def build_export(title, units, abilities):
    skills = {
        identifier: details for identifier, ability in abilities.items()
        if (details := skill_details(identifier, ability)) is not None
    }
    characters = [
        character for identifier, unit in units.items()
        if (character := build_character(identifier, unit, skills)) is not None
    ]
    if not characters:
        raise MapFormatError("No units use the supported ORDR rarity labels")
    rarity_order = {rarity: index for index, rarity in enumerate(RARITIES)}
    characters.sort(key=lambda row: (
        rarity_order[row["rarity"]], row["name"].casefold(), row["id"],
    ))
    return {"map": title, "tooltipLanguage": "en", "characters": characters}


def report_text(value):
    return re.sub(r"([\\`*_{}\[\]()|<>~&#])", r"\\\1", value)


def report_fields(record, strings, codes):
    for field in record.fields:
        if field.code in codes and field.kind == 3:
            text = visible_text(resolve_string(field.value, strings))
            if text:
                yield field, text


def report_name(texts):
    return report_text(" / ".join(dict.fromkeys(" ".join(text.split()) for text in texts)))


def write_readable_markdown(stream, source, title, units, abilities, strings, additional):
    stream.write("# ORDR 篩選前的單位與技能\n\n")
    stream.write(f"**地圖**　{report_text(' '.join(title.split()))}\n\n")
    stream.write(f"**來源**　{report_text(source.name)}\n\n")
    stream.write(
        f"讀取到 **{len(units):,} 筆單位**、**{len(abilities):,} 筆技能**、"
        f"**{len(strings):,} 筆地圖字串**。\n\n"
        "- 可搜尋英文名稱或四字元 ID。單位表的「—」表示地圖修改表沒有填寫該欄。"
        "部分技能 ID 來自遊戲的基礎資料，可能沒有對應的地圖技能紀錄。\n"
        "- 技能區列出物件名稱與各等級的提示文字，包含未連結到單位的技能。"
        "等級數字沿用地圖欄位的索引。\n"
        "- 這份清單尚未篩選角色稀有度或技能。文字已去除遊戲色碼並展開換行。"
        "查閱原始欄位與完整字串表時，可使用 `--raw-format fields`。\n\n"
    )
    stream.write("## 地圖中其他可讀的資料\n\n")
    stream.write("以下是根據已知檔名查到並成功讀取的成員。此清單的範圍限於已查找的檔名。\n\n")
    if additional:
        stream.write("| 檔名 | 內容 | 解壓後大小（位元組） |\n| --- | --- | ---: |\n")
        for name, size in additional.items():
            stream.write(f"| `{name}` | {ADDITIONAL_MEMBERS[name]} | {size:,} |\n")
        stream.write("\n")
    else:
        stream.write("此次查找未讀到其他常見成員。\n\n")

    stream.write("## 單位\n\n")
    stream.write(
        "| 單位 ID | 名稱 | 稱號 | 一般技能 ID | 英雄技能 ID |\n"
        "| --- | --- | --- | --- | --- |\n"
    )
    for record in units:
        entries = defaultdict(list)
        for field, value in report_fields(record, strings, {"unam", "upro", "uabi", "uhab"}):
            entries[field.code].append(value)
        columns = [f"`{record.identifier}`"]
        for code in ("unam", "upro"):
            columns.append(report_name(entries[code]) or "—")
        for code in ("uabi", "uhab"):
            identifiers = dict.fromkeys(
                identifier.strip()
                for group in entries[code]
                for identifier in group.split(",")
                if identifier.strip()
            )
            columns.append(", ".join(report_text(identifier) for identifier in identifiers) or "—")
        stream.write("| " + " | ".join(columns) + " |\n")

    stream.write("\n## 技能\n\n")
    tooltip_labels = {"atp1": "提示", "aub1": "說明"}
    for record in abilities:
        names = []
        tooltips = defaultdict(list)
        for field, value in report_fields(record, strings, {"anam", *tooltip_labels}):
            if field.code == "anam":
                names.append(value)
            else:
                tooltips[field.level].append((tooltip_labels[field.code], value))

        name = report_name(names)
        heading = f"`{record.identifier}`"
        if name:
            heading += f" · {name}"
        stream.write(f"### {heading}\n\n")
        if not tooltips:
            stream.write("此物件沒有記錄提示或說明文字。\n\n")
        for level, entries in sorted(tooltips.items()):
            stream.write(f"**等級 {level}**\n\n")
            for label, value in entries:
                stream.write(f"> **{label}**\n>\n")
                for line in value.splitlines():
                    text = report_text(line.strip())
                    stream.write(f"> {text}  \n" if text else ">\n")
                stream.write("\n")


def write_raw_markdown(stream, source, title, units, abilities, strings):
    stream.write("# ORDR Raw Map Data\n\n")
    stream.write("```text\n")
    stream.write(f"Source file: {json.dumps(source.name, ensure_ascii=False)}\n")
    stream.write(f"Map title: {json.dumps(title, ensure_ascii=False)}\n")
    stream.write("```\n\n")
    stream.write(
        "Object modifications are listed in file order, before skill and rarity filters. "
        "String values use JSON escaping. Resolved WTS text is shown alongside its reference.\n\n"
    )

    for label, member, records in (
        ("Units", "war3map.w3u", units),
        ("Abilities", "war3map.w3a", abilities),
    ):
        stream.write(f"## {label} (`{member}`, {len(records)} records)\n\n")
        stream.write("```text\n")
        for record in records:
            base_id = json.dumps(record.base_id, ensure_ascii=False)
            custom_id = json.dumps(record.custom_id, ensure_ascii=False)
            table = "custom" if record.is_custom else "original"
            stream.write(f"table={table}, base_id={base_id}, custom_id={custom_id}\n")
            for field in record.fields:
                code = json.dumps(field.code, ensure_ascii=False)
                value = json.dumps(field.value, ensure_ascii=False)
                stream.write(
                    f"{code}  type={field.kind}  level={field.level}  "
                    f"pointer={field.pointer}  value={value}"
                )
                if field.kind == 3:
                    resolved = resolve_string(field.value, strings)
                    if resolved != field.value:
                        stream.write(f"  resolved={json.dumps(resolved, ensure_ascii=False)}")
                stream.write("\n")
            stream.write("\n")
        stream.write("```\n\n")

    stream.write(f"## String table (`war3map.wts`, {len(strings)} entries)\n\n")
    stream.write("```text\n")
    for index, value in strings.items():
        stream.write(f"TRIGSTR_{index:03d} = {json.dumps(value, ensure_ascii=False)}\n")
    stream.write("```\n")


@contextmanager
def open_output(destination):
    staging = None
    try:
        with tempfile.NamedTemporaryFile(
            dir=destination.parent, prefix=destination.name + ".", suffix=".tmp",
            mode="w", encoding="utf-8", newline="\n", delete=False,
        ) as stream:
            staging = Path(stream.name)
            yield stream
        staging.replace(destination)
    finally:
        if staging is not None:
            staging.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("map_file", type=Path, help="Path to the English ORDR .w3x map")
    parser.add_argument("-o", "--output", type=Path, help="Path to the output JSON file")
    parser.add_argument("--raw-markdown", type=Path, help="Path to the unfiltered Markdown export")
    parser.add_argument(
        "--raw-format", choices=("readable", "fields"),
        help="Markdown layout (default: readable)",
    )
    parser.add_argument("--raw-only", action="store_true", help="Skip the filtered JSON export")
    args = parser.parse_args()
    if args.raw_only and (args.raw_markdown is None or args.output is not None):
        parser.error("--raw-only requires --raw-markdown and cannot be used with --output.")
    if args.raw_format is not None and args.raw_markdown is None:
        parser.error("--raw-format requires --raw-markdown.")
    source = args.map_file
    destination = args.output or source.with_name(source.stem + "-Character-Skills.json")
    if not args.raw_only and (
        destination.resolve() == source.resolve() or destination.suffix.lower() != ".json"
    ):
        parser.error("The output must be a separate .json file.")
    raw_destination = args.raw_markdown
    if raw_destination is not None and (
        raw_destination.resolve() == source.resolve()
        or raw_destination.suffix.lower() != ".md"
        or (not args.raw_only and raw_destination.resolve() == destination.resolve())
    ):
        parser.error("The raw Markdown output must be a separate .md file.")

    try:
        readable = raw_destination is not None and args.raw_format != "fields"
        title, units, abilities, strings, additional = read_map(source, inspect_members=readable)
        if raw_destination is not None:
            with open_output(raw_destination) as stream:
                if readable:
                    write_readable_markdown(stream, source, title, units, abilities, strings, additional)
                else:
                    write_raw_markdown(stream, source, title, units, abilities, strings)
            print(f"Exported {len(units)} raw unit records and {len(abilities)} raw ability records.")
            print(raw_destination.resolve())

        if args.raw_only:
            return 0

        data = build_export(
            title, resolve_objects(units, strings), resolve_objects(abilities, strings),
        )
        with open_output(destination) as stream:
            json.dump(data, stream, ensure_ascii=False, indent=2, allow_nan=False)
            stream.write("\n")
    except (OSError, ValueError) as exc:
        print(f"Export failed: {exc}", file=sys.stderr)
        return 1

    characters = data["characters"]
    skill_count = sum(len(character["skills"]) for character in characters)
    print(f"Exported {len(characters)} character records and {skill_count} skills.")
    print(destination.resolve())
    return 0


if __name__ == "__main__":
    sys.exit(main())
