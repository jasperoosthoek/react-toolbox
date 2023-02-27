import React, { useContext } from 'react';
import LocalizedStrings from 'react-localization';
import { defaultLocalization, AdditionalLocalization, LocalizationFunction } from './localization';

export const LocalizationContext = React.createContext({
  lang: 'en',
  text: (str: TemplateStringsArray, name: string) => {
    console.error('This component should be used as a child of LocalizationProvider.');
    return str[0];
  },
  strings: new LocalizedStrings({ en: {} }),
});

export type RestProps = {
  [prop: string]: any;
}
export interface LocalizationProviderProps extends RestProps {
  lang: string
  localization?: AdditionalLocalization;
  children: any;
  [prop: string]: any;
}

export const LocalizationProvider = ({
  lang = 'en',
  localization: additionalLocalization = {},
  children,
  ...restProps
 }: LocalizationProviderProps) => {
  const langs = Array.from(new Set([...Object.keys(defaultLocalization), ...Object.keys(additionalLocalization)]));
  const localizationStrings = langs.reduce(
    (o, lang) => {
      console.log(
        lang,
        defaultLocalization[lang],
        additionalLocalization[lang],
        {
          ...defaultLocalization[lang] || {},
          ...additionalLocalization[lang] || {},
        },
      )
      return ({
      ...o,
      [lang]: {
        ...defaultLocalization[lang] || {},
        ...additionalLocalization[lang] || {},
      },
    })}, {});
    
  const strings = new LocalizedStrings(localizationStrings);
  strings.setLanguage(lang);

  const text = (str: TemplateStringsArray, ...values: (string | number)[]) => {
    const text_or_func = strings.getString(str[0]) as string | LocalizationFunction;
    if (!text_or_func) {
      console.error(`Language string not found: "${str[0]}"`);
      return str[0];
    }

    return typeof text_or_func === 'function' ? text_or_func(...values) : text_or_func;
  }
  return (
    <LocalizationContext.Provider
      value={{
        lang,
        strings,
        text,
        ...restProps,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
