import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from '@/data/translations/ru.json';
import kz from '@/data/translations/kz.json';

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    kz: { translation: kz },
  },
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export default i18n;
