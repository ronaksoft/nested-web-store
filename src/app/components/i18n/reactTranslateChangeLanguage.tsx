export default (language) => {
    const reactTranslateChangeLanguage = new CustomEvent('reactTranslateChangeLanguage',
        { detail: language });
    window.dispatchEvent(reactTranslateChangeLanguage);
    window.document.dir = language === 'fa' ? 'rtl' : 'ltr';
    window.locale = language;
};
