import { AdditionalLocalization, combineLocalization } from '@jasperoosthoek/react-toolbox';


const localization = combineLocalization(
  {
    nl: {
      page_not_found: 'Pagina kan niet worden gevonden.',
      language_full: "Nederlands",

      link_datatable: 'Datatabellen',
      link_form: 'Formulieren',
    },
    en: {
      page_not_found: 'Page cannot be found.',
      language_full: "English",
      link_datatable: 'Data tabels',
      link_form: 'Forms',
    },
  }
 ) as AdditionalLocalization;

export default localization;