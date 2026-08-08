import appShared from './../shared/app-shared.js';
import { PATCH_NOTES } from './patch-notes-data.js';

const { escapeHtml } = appShared;

const state = {
  activePatchId: PATCH_NOTES[0]?.id || null,
  searchTerm: ''
};

function formatInlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
}

function parsePatchContent(content) {
  const sections = [];
  let currentSection = null;

  String(content || '')
    .split(/\r?\n/)
    .forEach((rawLine) => {
      const line = rawLine.replace(/^\s*>\s?/, '').trim();
      if (!line) {
        return;
      }

      const headingMatch = line.match(/^##\s+(.+)$/);
      if (headingMatch) {
        currentSection = {
          title: headingMatch[1],
          blocks: []
        };
        sections.push(currentSection);
        return;
      }

      if (!currentSection) {
        currentSection = {
          title: '更新內容',
          blocks: []
        };
        sections.push(currentSection);
      }

      const subItemMatch = line.match(/^-#\s+(.+)$/);
      if (subItemMatch) {
        currentSection.blocks.push({
          type: 'bullet',
          depth: 1,
          text: subItemMatch[1]
        });
        return;
      }

      const bulletMatch = line.match(/^[*-]\s+(.+)$/);
      if (bulletMatch) {
        currentSection.blocks.push({
          type: 'bullet',
          depth: 0,
          text: bulletMatch[1]
        });
        return;
      }

      currentSection.blocks.push({
        type: 'paragraph',
        text: line
      });
    });

  return sections;
}

function renderBlocks(blocks) {
  let html = '';
  let listItems = [];

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    html += `
      <ul class="patch-note-list">
        ${listItems
          .map(
            ({ depth, text }) => `
              <li class="${depth > 0 ? 'patch-note-subitem' : ''}">
                ${formatInlineMarkdown(text)}
              </li>
            `
          )
          .join('')}
      </ul>
    `;
    listItems = [];
  };

  blocks.forEach((block) => {
    if (block.type === 'bullet') {
      listItems.push(block);
      return;
    }

    flushList();
    html += `<p class="patch-note-paragraph">${formatInlineMarkdown(block.text)}</p>`;
  });

  flushList();
  return html;
}

function renderPatchContent(patch, contentElement) {
  if (!patch) {
    contentElement.innerHTML = `
      <div class="patch-empty-state">
        <strong>目前沒有可顯示的版本更新。</strong>
        <span>請在 patch-notes-data.js 的 PATCH_NOTES 陣列中加入新的版本資料。</span>
      </div>
    `;
    return;
  }

  const sections = parsePatchContent(patch.content);
  const itemCount = sections.reduce(
    (count, section) => count + section.blocks.filter((block) => block.type === 'bullet').length,
    0
  );

  contentElement.innerHTML = `
    <article class="patch-note-article">
      <header class="patch-note-article-header">
        <div>
          <span class="patch-note-kicker">PATCH NOTES</span>
          <h2>${escapeHtml(patch.title)}</h2>
          <p>${escapeHtml(patch.summary)}</p>
        </div>
        <div class="patch-note-meta">
          <span class="patch-note-version">v${escapeHtml(patch.version)}</span>
          <!-- <span>${escapeHtml(patch.releasedAt)}</span> -->
          <!-- <span>${sections.length} 個分類 · ${itemCount} 項更新</span> -->
        </div>
      </header>
      <div class="patch-note-sections">
        ${sections
          .map(
            (section, index) => `
              <section class="patch-note-section" id="${escapeHtml(patch.id)}-section-${index + 1}">
                <h3>${escapeHtml(section.title)}</h3>
                ${renderBlocks(section.blocks)}
              </section>
            `
          )
          .join('')}
      </div>
    </article>
  `;
}

function getVisiblePatches() {
  const keyword = state.searchTerm.trim().toLowerCase();
  if (!keyword) {
    return PATCH_NOTES;
  }

  return PATCH_NOTES.filter((patch) =>
    [patch.version, patch.title, patch.releasedAt, patch.summary, patch.content].some((value) =>
      String(value || '').toLowerCase().includes(keyword)
    )
  );
}

function renderVersionList(versionListElement) {
  const visiblePatches = getVisiblePatches();

  if (visiblePatches.length === 0) {
    versionListElement.innerHTML = `
      <div class="patch-empty-state patch-empty-state-small">
        <strong>找不到符合的版本。</strong>
      </div>
    `;
    return;
  }

  versionListElement.innerHTML = visiblePatches
    .map(
      (patch, index) => `
        <button
          type="button"
          class="patch-version-button ${patch.id === state.activePatchId ? 'active' : ''}"
          data-patch-id="${escapeHtml(patch.id)}"
          aria-pressed="${patch.id === state.activePatchId}"
        >
          <span class="patch-version-button-topline">
            <strong>v${escapeHtml(patch.version)}</strong>
            ${index === 0 && PATCH_NOTES[0]?.id === patch.id ? '<span class="patch-latest-badge">LATEST</span>' : ''}
          </span>
          <span class="patch-version-date">${escapeHtml(patch.releasedAt)}</span>
          <span class="patch-version-summary">${escapeHtml(patch.summary)}</span>
        </button>
      `
    )
    .join('');
}

function initPatchNotesPage() {
  const versionListElement = document.getElementById('patchVersionList');
  const contentElement = document.getElementById('patchNoteContent');
  const searchInput = document.getElementById('patchVersionSearch');

  if (!versionListElement || !contentElement || !searchInput) {
    return;
  }

  const render = () => {
    const visiblePatches = getVisiblePatches();
    const activePatch = PATCH_NOTES.find((patch) => patch.id === state.activePatchId);

    if ((!activePatch || !visiblePatches.some((patch) => patch.id === activePatch.id)) && visiblePatches[0]) {
      state.activePatchId = visiblePatches[0].id;
    }

    renderVersionList(versionListElement);
    renderPatchContent(
      PATCH_NOTES.find((patch) => patch.id === state.activePatchId),
      contentElement
    );
  };

  searchInput.addEventListener('input', () => {
    state.searchTerm = searchInput.value;
    render();
  });

  versionListElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-patch-id]');
    if (!button) {
      return;
    }

    state.activePatchId = button.dataset.patchId;
    render();
  });

  render();
}

if (typeof window !== 'undefined' && window.ORDApp) {
  window.ORDApp.initPatchNotesPage = initPatchNotesPage;
}

export default initPatchNotesPage;
