import React, { useState, useContext, useEffect, useMemo } from 'react';
import LocalizedStrings from 'react-localization';
import {
  defaultLocalization,
  AdditionalLocalization,
  LocalizationElement,
  LocalizationFunction,
  defaultLanguages,
} from './localization';

const out_of_context_error = 'This function should only be used in a child of LocalizationProvider.';

export const combineLocalization = (...locals: AdditionalLocalization[]) => {
  if (locals.length === 0) {
    return {} as AdditionalLocalization;
  }
  
  // Filter out empty objects
  const validLocals = locals.filter(local => local && Object.keys(local).length > 0);
  
  if (validLocals.length === 0) {
    return {} as AdditionalLocalization;
  }
  
  // Extract all unique language keys
  const languages = [...new Set(validLocals.flatMap(Object.keys))];

  return languages.reduce(
    (o, lang) => ({
      ...o,
      [lang]: validLocals.reduce<LocalizationElement>(
        (acc, l) => ({ ...acc, ...(l[lang] || {}) }),
        {} as LocalizationElement
      ),
    }),
    {} as AdditionalLocalization
  );
};

export const LocalizationContext = React.createContext({
  lang: 'en',
  languages: Object.keys(defaultLanguages),
  setLanguage: (lang: string) => console.error(out_of_context_error),
  text: (str: TemplateStringsArray, ...values: (string | number)[]) => {
    console.error(out_of_context_error);
    return str[0];
  },
  textByLang: (lang: string) => (str: TemplateStringsArray, ...values: (string | number)[]) => {
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
  lang?: string;
  localization?: AdditionalLocalization;
  languages?: string[];
  children?: any;
  [prop: string]: any;
}

export const LocalizationProvider = ({
  lang: initialLanguage = 'en',
  localization: additionalLocalizationInitial = {},
  languages: languagesOverride,
  children,
  ...restProps
 }: LocalizationProviderProps) => {
  const [additionalLocalization, setAdditionalLocalization] = useState(additionalLocalizationInitial);
  const [lang, setLanguage] = useState(initialLanguage);
  
  const languages = Array.from(new Set([
    ...languagesOverride || Object.keys(defaultLocalization),
    ...Object.keys(additionalLocalization),
  ]));
  
  const localizationStrings = useMemo(() => {
    return languages.reduce(
      (o, lang) => ({
        ...o,
        [lang]: {
          ...defaultLocalization[lang] || {},
          ...additionalLocalization[lang] || {},
        },
      }),
      {}
    );
  }, [languages, additionalLocalization]);
    
  const strings = useMemo(() => {
    const localizedStrings = new LocalizedStrings(localizationStrings);
    localizedStrings.setLanguage(lang);
    return localizedStrings;
  }, [localizationStrings, lang]);

  const setLocalization = (newLocalization: AdditionalLocalization) => {
    setAdditionalLocalization(prev => {
      const merged = combineLocalization(prev, newLocalization);
      return merged;
    });
  };

  const textByLang = (lang: string) => (str: TemplateStringsArray, ...values: (string | number)[]) => {
    const text_or_func = strings.getString(str[0], lang) as string | LocalizationFunction;
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
        setLanguage: (newLang: string) => {
          if (!languages.includes(newLang)) {
            console.error(`Language ${newLang} not available`);
            return;
          }
          setLanguage(newLang);
        },
        strings,
        text: textByLang(lang),
        textByLang,
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
