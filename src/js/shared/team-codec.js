function encodeTeamCharacterIds(characterIds) {
  const ids = [...new Set(characterIds.map((id) => String(id).trim()).filter(Boolean))];
  return btoa(ids.join(','));
}

function decodeTeamCharacterIds(code) {
  const encoded = String(code || '').trim();
  if (!encoded) {
    return [];
  }

  const decoded = atob(encoded);
  return [...new Set(decoded.split(',').map((id) => id.trim()).filter(Boolean))];
}

export { encodeTeamCharacterIds, decodeTeamCharacterIds };
