export type LocalizationFunction = (...args: (string | number)[]) => string;

export type LocalizationElement = {
  [languageString: string]: (string | LocalizationFunction)
}

export type AdditionalLocalization = {
  [lang: string]: LocalizationElement;
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
  send: string;
  your_email: string;
  enter_email: string;
  your_password: string;
  enter_password: string;
  login: string;
  logout: string;
  forgot_password: string;
  reset_password: string;
  enter_email_for_reset: string;
  reset_link_sent: string;
  back_to_login: string;
  set_new_password: string;
  new_password: string;
  confirm_password: string;
  passwords_must_match: string;
  required_field: string;
  date_range_from: string;
  date_range_to: string;
  date_range_to_before_from: string;
  choose_one: string;
  everything: string;
  number_of_rows: string;
  modal_create: string;
  modal_edit: string;
}

export type Localization = {
  [lang: string]: LocalizationStrings;
}

export type Languages = {
  [languageIso: string]: string;
}
export const defaultLanguages: Languages = {
  en: "English",
  fr: "Français",
  nl: "Nederlands",
} as const;

export const defaultLocalization: Localization = {
  en: {
    select: "Select",
    search: "Search",
    no_information_to_display: "No information to display",
    information_is_being_loaded: "The information is being loaded...",
    delete: "Delete",
    are_you_sure: "Are you sure?",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    ok: "OK",
    send: "Send",
    your_email: "Your email",
    enter_email: "Enter email address",
    your_password: "Your password",
    enter_password: "Enter password",
    login: "Login",
    logout: "Logout",
    forgot_password: "Forgot password?",
    reset_password: "Reset password",
    enter_email_for_reset: "Enter your email address to receive a password reset link.",
    reset_link_sent: "A password reset link has been sent to your email address.",
    back_to_login: "Back to login",
    set_new_password: "Set new password",
    new_password: "New password",
    confirm_password: "Confirm password",
    passwords_must_match: "Passwords must match",
    required_field: "required",
    date_range_from: "From",
    date_range_to: "To",
    date_range_to_before_from: "end date must be after start date",
    choose_one: "Choose one",
    everything: "Everything",
    number_of_rows: "Number of rows",
    modal_create: 'New',
    modal_edit: 'Edit',
  },
  fr: {
    select: "Sélectionner",
    search: "Recherche",
    no_information_to_display: "Aucune information à afficher",
    information_is_being_loaded: "L'information est en cours de téléchargement...",
    delete: "Supprimer",
    are_you_sure: "Êtes-vous sûr?",
    close: "Fermer",
    save: "Sauvegarder",
    cancel: "Annuler",
    ok: "D'accord'",
    send: "Envoyer",
    your_email: "Votre adresse e-mail",
    enter_email: "Entrez l'adresse e-mail",
    your_password: "Votre mot de passe",
    enter_password: "Entrez votre mot de passe",
    login: "Connexion",
    logout: "Se déconnecter",
    forgot_password: "Mot de passe oublié?",
    reset_password: "Réinitialiser le mot de passe",
    enter_email_for_reset: "Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.",
    reset_link_sent: "Un lien de réinitialisation a été envoyé à votre adresse e-mail.",
    back_to_login: "Retour à la connexion",
    set_new_password: "Définir un nouveau mot de passe",
    new_password: "Nouveau mot de passe",
    confirm_password: "Confirmer le mot de passe",
    passwords_must_match: "Les mots de passe doivent correspondre",
    required_field: "requis",
    date_range_from: "De",
    date_range_to: "À",
    date_range_to_before_from: "la date de fin doit être après la date de début",
    choose_one: "Choisissez-en un",
    everything: "Tout",
    number_of_rows: "Nombre de rangées",
    modal_create: 'Nouveau',
    modal_edit: 'Éditer',
  },
  nl: {
    select: "Selecteer",
    search: "Zoeken",
    no_information_to_display: "Geen informatie om weer te geven.",
    information_is_being_loaded: "De gegevens worden geladen...",
    delete: "Verwijderen",
    are_you_sure: "Weet u het zeker?",
    close: "Sluiten",
    save: "Opslaan",
    cancel: "Annuleren",
    ok: "OK",
    send: "Versturen",
    your_email: "Uw e-mail",
    enter_email: "Voer e-mailadres in",
    your_password: "Uw wachtwoord",
    enter_password: "Voer wachtwoord in",
    login: "Inloggen",
    logout: "Uitloggen",
    forgot_password: "Wachtwoord vergeten?",
    reset_password: "Wachtwoord resetten",
    enter_email_for_reset: "Voer uw e-mailadres in om een wachtwoord reset link te ontvangen.",
    reset_link_sent: "Een wachtwoord reset link is naar uw e-mailadres verzonden.",
    back_to_login: "Terug naar inloggen",
    set_new_password: "Nieuw wachtwoord instellen",
    new_password: "Nieuw wachtwoord",
    confirm_password: "Bevestig wachtwoord",
    passwords_must_match: "Wachtwoorden moeten overeenkomen",
    required_field: "verplicht",
    date_range_from: "Van",
    date_range_to: "Tot",
    date_range_to_before_from: "de einddatum moet na de startdatum zijn",
    choose_one: "Maak een keuze",
    everything: "Alles",
    number_of_rows: "Aantal rijen",
    modal_create: 'Nieuw',
    modal_edit: 'Bewerken',
  },
} as const;

