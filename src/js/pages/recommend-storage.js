const PINNED_STORAGE_KEY = 'pinnedCharacters';

// 從 localStorage 讀取釘選角色 ID。
function getPinnedCharacters(storage = localStorage) {
  try {
    const pinned = storage.getItem(PINNED_STORAGE_KEY);
    const parsed = pinned ? JSON.parse(pinned) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 將角色加入釘選清單或從清單移除。
function togglePinnedCharacter(characterId, storage = localStorage) {
  const pinned = getPinnedCharacters(storage);
  const index = pinned.indexOf(characterId);
  if (index === -1) pinned.push(characterId);
  else pinned.splice(index, 1);
  storage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinned));
  return index === -1;
}

// 清除所有釘選角色。
function clearPinnedCharacters(storage = localStorage) {
  storage.removeItem(PINNED_STORAGE_KEY);
}

// 將目前釘選角色產生為已翻譯且已跳脫的 HTML。
function buildPinnedCharactersHtml(records, escapeHtml, getDisplayName, storage = localStorage) {
  return getPinnedCharacters(storage)
    .map((characterId) => {
      const record = records.find((item) => item.character_id === characterId);
      if (!record) return '';
      const name = getDisplayName(record);
      return `<span class="text-lv-${record.level}" title="${escapeHtml(name)}">${escapeHtml(name)}</span>`;
    })
    .join(' | ');
}

// 調整 Tom Select 中的重複項目，直到達到指定數量。
function setTomItemCount(tomSelectInstance, value, targetCount) {
  let effectCount = 0;
  const currentItems = tomSelectInstance.getValue();
  const currentCount = currentItems.filter((item) => item === value).length;

  if (targetCount > currentCount) {
    for (let i = 0; i < targetCount - currentCount; i += 1) {
      tomSelectInstance.addItem(value, true);
      effectCount += 1;
    }
  } else if (targetCount < currentCount) {
    for (let i = 0; i < currentCount - targetCount; i += 1) {
      tomSelectInstance.removeItem(value, true);
      effectCount += 1;
    }
  }
  return effectCount;
}

export {
  getPinnedCharacters,
  togglePinnedCharacter,
  clearPinnedCharacters,
  buildPinnedCharactersHtml,
  setTomItemCount,
};
