import React, { useContext, useMemo } from 'react';
import LocalizedStrings from 'react-localization';
import defaultStrings from './strings';

export const LocalizationContext = React.createContext();

export const LocalizationProvider = ({
  lang = 'en',
  strings: additionalStrings = {},
  children,
  ...restProps
 }) => {
  const langs = Array.from(new Set([...Object.keys(defaultStrings), ...Object.keys(additionalStrings)]));
  const localizationStrings = langs.reduce(
    (o, lang) => ({
      ...o,
      [lang]: {
        ...defaultStrings[lang] || {},
        ...additionalStrings[lang] || {},
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
