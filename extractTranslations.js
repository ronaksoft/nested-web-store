let extractTranslations = require('./src/app/components/i18n/getTranslations');
extractTranslations.extract('./src/app/*/**/*.tsx', './src/app/components/i18n/translations.json', ['en', 'fa']);