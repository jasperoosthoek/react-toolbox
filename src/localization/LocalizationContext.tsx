import React, { useContext } from 'react';
import LocalizedStrings from 'react-localization';
import defaultLocalization, { AdditionalLocalization } from './localization';

export const LocalizationContext = React.createContext({
  lang: 'en',
  strings: new LocalizedStrings({ en: {} }),
});

export type RestProps = {
  [prop: string]: any;
}
export interface LocalizationProviderProps extends RestProps {
  lang: string
  localization: AdditionalLocalization;
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
    (o, lang) => ({
      ...o,
      [lang]: {
        ...defaultLocalization[lang] || {},
        ...additionalLocalization[lang] || {},
      },
    }), {});
    
  const strings = new LocalizedStrings(localizationStrings);
  strings.setLanguage(lang);
  return (
    <LocalizationContext.Provider
      value={{
        lang,
        strings,
        ...restProps,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
