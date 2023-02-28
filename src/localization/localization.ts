import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';

export type LocalizationFunction = (...args: (string | number)[]) => string;

export type AdditionalLocalization = {
  [lang: string]: {
    [languageString: string]: string | LocalizationFunction;
  }
}
export interface LocalizationStrings {
  select: string;
  search: string;
  no_information_to_display: string;
  information_is_being_loaded: string;
  delete: string;
  are_you_sure: string;
  close: string;
  save: string;
  cancel: string;
  ok: string;
  your_email: string;
  your_password: string;
  enter_password: string;
  login: string;
  logout: string;
  forgot_password: string;
  reset_password: string;
  required_field: string;
  choose_one: string;
  everything: string;
  number_of_rows: string;
}

export type Localization = {
  [lang: string]: LocalizationStrings;
}

export type Languages = {
  [languageIso: string]: string;
}
export const defaultLanguages: Languages = {
  en: 'English',
  fr: 'Français',
  nl: 'Nederlands',
} as const;

export const defaultLocalization: Localization = {
  en: {
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
    logout: 'Logout',
    forgot_password: 'Forgot password?',
    reset_password: 'Reset password',
    required_field: 'required',
    choose_one: 'Choose one',
    everything: 'Everything',
    number_of_rows: 'Number of rows',
  },
  fr: {
    no_information_to_display: 'Sélectionner',
    select: 'Recherche',
    search: 'Aucune information à afficher',
    information_is_being_loaded: "L'information est en cours de téléchargement...",
    delete: 'Supprimer',
    are_you_sure: 'Es-tu sûr?',
    close: 'Fermer',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    ok: "D'accord'",
    your_email: 'Votre e-mail',
    your_password: 'Votre mot de passe',
    enter_password: 'Entrer le mot de passe',
    login: 'Connexion',
    logout: 'Se déconnecter',
    forgot_password: 'Mot de passe oublié?',
    reset_password: 'Réinitialiser le mot de passe',
    required_field: 'requis',
    choose_one: 'Choisissez-en un',
    number_of_rows: 'Tout',
    everything: 'Nombre de rangées',
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
    logout: 'Uitloggen',
    forgot_password: 'Wachtwoord vergeten?',
    reset_password: 'Wachtwoord resetten',
    required_field: 'verplicht',
    choose_one: 'Maak een keuze',
    number_of_rows: 'Aantal rijen',
    everything: 'Alles',
  },
} as const;

