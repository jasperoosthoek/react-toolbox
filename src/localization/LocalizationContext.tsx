import React, { useState, useContext } from 'react';
import LocalizedStrings from 'react-localization';
import {
  defaultLocalization,
  AdditionalLocalization,
  LocalizationFunction,
  defaultLanguages,
  Languages,
} from './localization';

const out_of_context_error = 'This function should only be used in a child of LocalizationProvider.';

export const LocalizationContext = React.createContext({
  lang: 'en',
  languages: Object.keys(defaultLanguages),
  setLanguage: (lang: string) => console.error(out_of_context_error),
  text: (str: TemplateStringsArray, ...values: (string | number)[]) => {
    console.error(out_of_context_error);
    return str[0];
  },
  strings: new LocalizedStrings({ en: {} }),
  localizationStrings: {} as AdditionalLocalization,
  setLocalization: (localization: AdditionalLocalization) => console.error(out_of_context_error),
});

export type RestProps = {
  [prop: string]: any;
}
export interface LocalizationProviderProps extends RestProps {
  lang: string;
  localization?: AdditionalLocalization;
  languages?: string[];
  children: any;
  [prop: string]: any;
}

export const LocalizationProvider = ({
  lang: initialLanguage = 'en',
  localization: additionalLocalizationInitial = {},
  languages: languagesOverride,
  children,
  ...restProps
 }: LocalizationProviderProps) => {
  const [additionalLocalization, setLocalization] = useState(additionalLocalizationInitial);
  const [lang, setLanguage] = useState(initialLanguage);
  const languages = Array.from(new Set([
    ...languagesOverride || Object.keys(defaultLocalization),
    ...Object.keys(additionalLocalization),
  ]));
  const localizationStrings = languages.reduce(
    (o, lang) => ({
      ...o,
      [lang]: {
        ...defaultLocalization[lang] || {},
        ...additionalLocalization[lang] || {},
      },
    }), {});
    
  const strings = new LocalizedStrings(localizationStrings);
  strings.setLanguage(lang);

  const text = (str: TemplateStringsArray, ...values: (string | number)[]) => {
    const text_or_func = strings.getString(str[0]) as string | LocalizationFunction;
    if (!text_or_func) {
      console.error(`Language string not found: "${str[0]}"`);
      return str[0];
    } else if (typeof text_or_func === 'function') {
      if (text_or_func.length !== values.length) {
        console.error(
          `Language function "${str[0]}" expects exactly ${text_or_func.length} argument${text_or_func.length === 1 ? '' : 's'}. `
          + (
            text_or_func.length > 0
            ? ` Use text${'`'}${str[0]}${'${arg1}${arg2}`'}`
            : ` Use text${'`'}${str[0]}${'`'}`
          )
        );
        return text_or_func.length > 0 ? `${str[0]}${'${arg1}${arg2}'}` : str[0];
      }
      return text_or_func(...values);
    }

    return text_or_func;
  }
  return (
    <LocalizationContext.Provider
      value={{
        lang,
        languages,
        setLanguage: (lang: string) => {
          if (!languages.includes(lang)) {
            console.error(`Language ${lang} not available`);
            return;
          }
          setLanguage(lang);
        },
        strings,
        text,
        localizationStrings,
        setLocalization,
        ...restProps,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
