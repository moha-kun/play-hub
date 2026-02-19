import {RootTranslateServiceConfig} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

export function translationServiceProvider() : RootTranslateServiceConfig {
  const defaultLang = 'en';
  const storedLang = localStorage.getItem('lang');
  let chosenLang;
  if (!storedLang) {
    chosenLang = defaultLang;
    localStorage.setItem('lang', defaultLang);
  } else {
    chosenLang = storedLang;
  }

  return {
    lang: chosenLang,
    fallbackLang: defaultLang,
    loader: provideTranslateHttpLoader({
      prefix: '/i18n/',
      suffix: '.json'
    })
  };
}
