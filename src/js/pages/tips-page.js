import { ORDI18n } from '../i18n.js';

export default function initTipsPage(records) {
  const characters = new Map(records.map(record => [record.character_id, record]));
  document.querySelectorAll('.tips-story-table [data-character-id]').forEach(cell => {
    const character = characters.get(cell.dataset.characterId);
    if (character) {
      cell.textContent = ORDI18n.getDisplayName(character);
    }
  });

  function openSection(hash) {
    const section = document.getElementById(hash.slice(1));
    if (section?.matches('details.tips-section')) {
      section.open = true;
    }
  }

  document.querySelectorAll('.tips-nav a').forEach(link => {
    link.addEventListener('click', () => openSection(link.hash));
  });
  window.addEventListener('hashchange', () => openSection(window.location.hash));
  openSection(window.location.hash);
}
