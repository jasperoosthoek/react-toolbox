import React, { useContext } from 'react';
import LocalizedStrings from 'react-localization';

const localizationStrings = {
  en:{
    select: 'Select',
    search: 'Search',
    no_information_to_display: 'No information to display',
    information_is_being_loaded: 'The information is being loaded...',
    delete: 'Delete',
    are_you_sure: 'Are you sure?',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    ok: 'OK',
    your_email: 'Your email',
    your_password: 'Your password',
    enter_password: 'Enter password',
    login: 'Login',
    forgot_password: 'Forgot password?',
    reset_password: 'Reset password',
    required_field: 'required',
    choose_one: 'Choose one',
  },
  nl: {
    no_information_to_display: 'Geen informatie om weer te geven.',
    select: 'Selecteer',
    search: 'Zoeken',
    information_is_being_loaded: 'De gegevens worden geladen...',
    delete: 'Verwijderen',
    are_you_sure: 'Weet u het zeker?',
    close: 'Sluiten',
    save: 'Opslaan',
    cancel: 'Annuleren',
    ok: 'OK',
    your_email: 'Uw email',
    your_password: 'Uw wachtwoord',
    enter_password: 'Voer wachtwoord in',
    login: 'Inloggen',
    forgot_password: 'Wachtwoord vergeten?',
    reset_password: 'Wachtwoord resetten',
    required_field: 'verplicht',
    choose_one: 'Maak een keuze',
  },
};

export const LocalizationContext = React.createContext();

export const LocalizationProvider = ({
  lang = 'en',
  strings: additionalStrings = {},
  children,
  ...restProps
 }) => {
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

export const useLocalization = () => useContext(LocalizationContext);
