import React, { useState, useContext, useMemo } from 'react';
import LocalizedStrings from 'react-localization';
import {
  defaultLocalization,
  AdditionalLocalization,
  defaultLanguages,
} from './localization';
import { combineLocalization, createText, Text, TextValue } from './text';

// Kept here for existing imports from this module
export { combineLocalization };

const out_of_context_error = 'This function should only be used in a child of LocalizationProvider.';

const outOfContextText = (lang: string): Text => {
  const text = ((str: TemplateStringsArray, ...values: TextValue[]) => {
    console.error(out_of_context_error);
    return str[0];
  }) as Text;
  text.byKey = (key: string) => {
    console.error(out_of_context_error);
    return key;
  };
  text.hasKey = () => {
    console.error(out_of_context_error);
    return false;
  };
  text.lang = lang;
  return text;
};

export const LocalizationContext = React.createContext({
  lang: 'en',
  languages: Object.keys(defaultLanguages),
  setLanguage: (lang: string) => console.error(out_of_context_error),
  text: outOfContextText('en'),
  textByLang: (lang: string) => outOfContextText(lang),
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

// Module-level constant so an omitted localization prop has a stable identity
const emptyLocalization: AdditionalLocalization = {};

export const LocalizationProvider = ({
  lang: langProp = 'en',
  localization: localizationProp = emptyLocalization,
  languages: languagesOverride,
  children,
  ...restProps
 }: LocalizationProviderProps) => {
  // The lang prop sets the language whenever it changes; setLanguage changes it in between
  const [lang, setLanguage] = useState(langProp);
  const [prevLangProp, setPrevLangProp] = useState(langProp);
  if (langProp !== prevLangProp) {
    setPrevLangProp(langProp);
    setLanguage(langProp);
  }

  // Only additions made with setLocalization are state; the localization prop is merged in on every change, so a new
  // (inline) localization object neither resets the additions nor is ignored
  const [additions, setAdditions] = useState(emptyLocalization);
  const additionalLocalization = useMemo(
    () => combineLocalization(localizationProp, additions),
    [localizationProp, additions]
  );

  const languageList = Array.from(new Set([
    ...languagesOverride || Object.keys(defaultLocalization),
    ...Object.keys(additionalLocalization),
  ]));
  // Memoized on the content so the array (and everything derived from it) keeps its identity between renders
  const languagesKey = languageList.join(',');
  const languages = useMemo(() => languageList, [languagesKey]);
  
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
    setAdditions(prev => combineLocalization(prev, newLocalization));
  };

  // One text snapshot per requested language, rebuilt when the strings or the default language change. Takes the
  // language at call time: it never captures the provider's current language.
  const textByLang = useMemo(() => {
    const cache = new Map<string, Text>();
    return (requestedLang: string) => {
      let text = cache.get(requestedLang);
      if (!text) {
        text = createText(additionalLocalization, requestedLang, languages[0]);
        cache.set(requestedLang, text);
      }
      return text;
    };
  }, [additionalLocalization, languages]);

  const text = useMemo(() => textByLang(lang), [textByLang, lang]);

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
        text,
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
