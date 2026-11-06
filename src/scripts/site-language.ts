import { language, translate, type I18nKey, type Locale } from '../lib/i18n';
const STORAGE_KEY = 'astro-notebook.language';
document.documentElement.classList.add('js-ready');
const toggle = document.querySelector<HTMLButtonElement>('[data-language-switch]');
function apply(locale: Locale, save = false) {
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(node => {
    node.textContent = translate(node.dataset.i18n as I18nKey, locale);
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach(node => {
    node.setAttribute('aria-label', translate(node.dataset.i18nAria as I18nKey, locale));
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-count]').forEach(node => {
    const count = Number(node.dataset.i18nCount || 0);
    node.textContent = locale === 'zh' ? `${count} 篇记录` : `${count} posts`;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-year-count]').forEach(node => {
    const count = Number(node.dataset.i18nYearCount || 0);
    node.textContent = `${count} posts`;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-month]').forEach(node => {
    const month = node.dataset.i18nMonth || '';
    node.textContent = locale === 'zh' ? `${month} 月` : `Month ${month}`;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-tag-count]').forEach(node => {
    const count = Number(node.dataset.i18nTagCount || 0);
    node.textContent = locale === 'zh' ? `${count} 篇带有此标签的文章。` : `${count} posts with this tag.`;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-minute]').forEach(node => {
    const minutes = node.dataset.i18nMinute || '0';
    node.textContent = `${minutes} min read`;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-read-post]').forEach(node => {
    const title = node.dataset.i18nReadPost || '';
    node.setAttribute('aria-label', `${translate('readPost', locale)} ${title}`);
  });
  if (toggle) {
    toggle.textContent = locale === 'zh' ? 'EN' : '中';
    toggle.setAttribute('aria-label', translate('languageToggle', locale));
    toggle.setAttribute('title', translate('languageToggle', locale));
  }
  if (save) { try { localStorage.setItem(STORAGE_KEY, locale); } catch { /* storage blocked */ } }
  document.dispatchEvent(new CustomEvent('site:languagechange', { detail: { locale } }));
}
let initial: Locale = 'zh';
try { if (localStorage.getItem(STORAGE_KEY) === 'en') initial = 'en'; } catch { /* storage blocked */ }
apply(initial);
toggle?.addEventListener('click', () => apply(language() === 'zh' ? 'en' : 'zh', true));
window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY) apply(event.newValue === 'en' ? 'en' : 'zh');
});
