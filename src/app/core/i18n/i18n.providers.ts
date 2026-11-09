import { isDevMode } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-http.loader';

export const AVAILABLE_LANGS = ['en', 'pt-BR'] as const;
export type AppLang = (typeof AVAILABLE_LANGS)[number];
export const FALLBACK_LANG: AppLang = 'en';

/** Initial language is determined by the browser; any pt variant uses pt-BR. */
export function detectInitialLang(): AppLang {
  const preferred = typeof navigator === 'undefined' ? '' : navigator.language;
  return preferred.toLowerCase().startsWith('pt') ? 'pt-BR' : FALLBACK_LANG;
}

export function provideI18n() {
  return provideTransloco({
    config: {
      availableLangs: [...AVAILABLE_LANGS],
      defaultLang: detectInitialLang(),
      fallbackLang: FALLBACK_LANG,
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
  });
}
