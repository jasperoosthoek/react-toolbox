import React from 'react';
import LocalizedStrings from 'react-localization';

const localizationStrings = {
  en:{
    select: "Select",
    search: "Search",
    no_information_to_display: 'No information to display',
    information_is_being_loaded: 'The information is being loaded...',
    delete: 'Delete',
    are_you_sure: 'Weet u het zeker?',
    close: 'Close',
    save: 'Save',
  },
  nl: {
    no_information_to_display: 'Geen informatie om weer te geven.',
    select: "Selecteer",
    search: "Zoeken",
    information_is_being_loaded: 'De gegevens worden geladen...',
    delete: 'Verwijderen',
    are_you_sure: 'Are you sure?',
    close: 'Sluiten',
    save: 'Opslaan',
  }
};

export const LocalizationContext = React.createContext();

export const LocalizationProvider = ({ lang = 'en', strings: additionalStrings = {}, children, ...restProps }) => {
console.log({ lang })
  const strings = new LocalizedStrings({ ...localizationStrings, ...additionalStrings })
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

