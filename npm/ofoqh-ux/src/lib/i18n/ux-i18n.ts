import { InjectionToken } from '@angular/core';

export type UxTranslateFn = (key: string, fallback: string) => string;

export const UX_TRANSLATE = new InjectionToken<UxTranslateFn>('UX_TRANSLATE', {
  factory: () => (_key: string, fallback: string) => fallback,
});

export const UX_SHARED_DICTIONARIES = {
  en: {
    ux: {
      languageSwitcher: {
        label: 'Language',
      },
      searchFilterBar: {
        reset: 'Reset filters',
      },
      dataTable: {
        emptyState: 'No items found',
      },
    },
  },
  de: {
    ux: {
      languageSwitcher: {
        label: 'Sprache',
      },
      searchFilterBar: {
        reset: 'Filter zurucksetzen',
      },
      dataTable: {
        emptyState: 'Keine Eintrage gefunden',
      },
    },
  },
  fr: {
    ux: {
      languageSwitcher: {
        label: 'Langue',
      },
      searchFilterBar: {
        reset: 'Reinitialiser les filtres',
      },
      dataTable: {
        emptyState: 'Aucun element trouve',
      },
    },
  },
  es: {
    ux: {
      languageSwitcher: {
        label: 'Idioma',
      },
      searchFilterBar: {
        reset: 'Restablecer filtros',
      },
      dataTable: {
        emptyState: 'No se encontraron elementos',
      },
    },
  },
} as const;
