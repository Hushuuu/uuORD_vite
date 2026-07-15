import { ORDI18n } from './../i18n.js';

class MyFooter extends HTMLElement {
  constructor() {
    super();
    //a tag onclick event
    this._openEmail = this._openEmail.bind(this);
  }

  connectedCallback() {
    this._render();
    const feedbackLink = this.querySelector('.feedback-link');
    if (feedbackLink) {
      // 2. 綁定事件監聽
      feedbackLink.addEventListener('click', this._openEmail);
    }
  }

  disconnectedCallback() {
    const feedbackLink = this.querySelector('.feedback-link');
    if (feedbackLink) {
      feedbackLink.removeEventListener('click', this._openEmail);
    }
  }

  _openEmail(event) {
    event.preventDefault();
    const user = "jim";
    const domain = "nijidakku.cc";
    const subject = encodeURIComponent("【ORD網站使用者來信】");

    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=" + user + "@" + domain + "&su=" + subject, "_blank");
  }

  _render() {
    const i18n = ORDI18n || window.ORDI18n || null;
    const t = i18n && typeof i18n.t === 'function' ? i18n.t : (key) => key;
    const currentLang = i18n ? i18n.getLang() : 'zh';

    this.innerHTML = `
<style>
    :root {
        --bg-dark: #0f172a;
        /* slate-900 */
        --bg-darker: #020617;
        /* slate-950 */
        --border-color: #1e293b;
        /* slate-800 */
        --border-light: #334155;
        /* slate-700 */
        --text-primary: #f1f5f9;
        /* slate-100 */
        --text-secondary: #cbd5e1;
        /* slate-300 */
        --text-muted: #94a3b8;
        /* slate-400 */
        --text-dark: #64748b;
        /* slate-500 */
        --accent: #f59e0b;
        /* amber-500 */
        --accent-hover: #d97706;
        /* amber-600 */
    }
    footer {
        background-color: var(--bg-darker);
        border-top: 1px solid var(--border-color);
        padding: 2rem 0;
        text-align: center;
        font-size: 0.75rem;
        color: var(--text-dark);
    }

    .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .footer-container p {
        margin: 0.5rem 0;
    }
</style>
<footer>
    <div class="footer-container">
        <p>${t('footer.brand')}</p>
        <p>${t('footer.desc')}</p>
        <p>${t('footer.feedback')}
            <a style="text-decoration: underline; color: inherit;" href="#" class="feedback-link">Feedback</a>
        </p>
        <p>© 2026 ORD Fans. All rights reserved.</p>
    </div>
</footer>
    `;
  }
}

window.customElements.define('my-footer', MyFooter);