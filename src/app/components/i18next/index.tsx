import i18next from 'i18next';

i18next
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: 'en', // 'en' | 'fa'
    resources: {
      en: {
        translation: {
          name: { label: 'Name' },
        },
      },
      fa: {
        translation: {
          name: { label: 'نام' },
        },
      },
    },
  });

export default i18next;
