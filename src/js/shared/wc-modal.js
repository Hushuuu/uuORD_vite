class MyModal extends HTMLElement {
  static get observedAttributes() {
    return ['size'];
  }

  constructor() {
    super();
    this._isOpen = false;
  }

  connectedCallback() {
    const initialContent = this.innerHTML;

    this.innerHTML = `
      <style>
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.25s ease, visibility 0.25s ease;
          padding: 16px;
          box-sizing: border-box;
        }

        .modal-overlay.is-open {
          opacity: 1;
          visibility: visible;
        }

        .modal-card {
          background: #1e293b;
          color: #f8fafc;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          position: relative;
          transform: translateY(-20px);
          transition: transform 0.25s ease, width 0.2s ease, height 0.2s ease;
          max-height: 90vh;
          overflow-y: auto;
          box-sizing: border-box;
        }

        .modal-overlay.is-open .modal-card {
          transform: translateY(0);
        }

        /* ------------------ 尺寸設定 ------------------ */
        /* 小 (Small) - 適用於確認框、提示訊息 */
        .modal-card.size-small {
          max-width: 500px;
        }

        /* 中 (Medium - 預設) - 適用於一般表單、設定選項 */
        .modal-card.size-medium {
          max-width: 700px;
        }

        .modal-card.size-large {
          max-width: 1000px;
        }

        /* 大 / FullModal - 佔滿全螢幕 (保留邊距或完全貼邊) */
        .modal-card.size-full {
          max-width: 100vw;
          width: 100%;
          height: 100%;
          max-height: 100vh;
          border-radius: 0; /* 全螢幕時邊角拉直 */
          border: none;
        }

        /* 全螢幕時 overlay 邊距歸零 */
        .modal-overlay.has-full-modal {
          padding: 0;
        }

        /* ------------------ 關閉按鈕 ------------------ */
        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #94a3b8;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        .modal-body {
          margin-top: 12px;
        }
      </style>

      <div class="modal-overlay" id="overlay">
        <div class="modal-card size-medium" id="card">
          <button type="button" class="modal-close-btn" data-action="close">&times;</button>
          <div class="modal-body">
            ${initialContent}
          </div>
        </div>
      </div>
    `;

    // 初始化更新尺寸
    this._updateSize();

    // 事件監聽
    this.addEventListener('click', (e) => {
      if (
        e.target.closest('[data-action="close"]') || 
        e.target === this.querySelector('#overlay')
      ) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.close();
      }
    });
  }

  // 當屬性改變時自動調用（例如用 JS 動態修屬性 `modal.setAttribute('size', 'large')`）
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'size' && oldValue !== newValue) {
      this._updateSize();
    }
  }

  _updateSize() {
    const card = this.querySelector('#card');
    const overlay = this.querySelector('#overlay');
    if (!card || !overlay) return;

    const size = (this.getAttribute('size') || 'medium').toLowerCase();

    // 移除舊的 size class
    card.classList.remove('size-small', 'size-medium', 'size-large', 'size-full');
    overlay.classList.remove('has-full-modal');

    // 套用新的 size class
    if (size === 'small') {
      card.classList.add('size-small');
    } else if (size === 'large') {
      card.classList.add('size-large');
    } else if (size === 'full') {
      card.classList.add('size-full');
      overlay.classList.add('has-full-modal');
    }else {
      card.classList.add('size-medium');
    }
  }

  open() {
    this._isOpen = true;
    const overlay = this.querySelector('#overlay');
    if (overlay) overlay.classList.add('is-open');
  }

  close() {
    this._isOpen = false;
    const overlay = this.querySelector('#overlay');
    if (overlay) overlay.classList.remove('is-open');
  }

  toggle() {
    this._isOpen ? this.close() : this.open();
  }
}

window.customElements.define('my-modal', MyModal);

/*
  <my-modal id="modalMedium" size="medium">
    <h3>一般設定</h3>
    <p>這裡填寫一般編輯表單或基本設定。</p>
  </my-modal>
 */