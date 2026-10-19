import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonGroup, Table } from 'react-bootstrap';
import { LocalizationProvider, useLocalization } from '../../../src/localization/LocalizationContext';
import { defaultLanguages } from '../../../src/localization/localization';

const keys = ['welcome', 'only_in_english', 'cancel', 'save', 'delete', 'search'];

const Missing = () => <span className="text-muted">(not found)</span>;

const LocalizationState = () => {
  const { lang, languages, setLanguage, text, textByLang } = useLocalization();
  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-3">
        <ButtonGroup>
          {languages.map((language) => (
            <Button
              key={language}
              size="sm"
              variant={language === lang ? 'primary' : 'outline-primary'}
              onClick={() => setLanguage(language)}
            >
              {defaultLanguages[language] ?? language}
            </Button>
          ))}
        </ButtonGroup>
        <code>lang = "{lang}"</code>
      </div>
      <Table size="sm" bordered style={{ width: 'auto' }}>
        <thead>
          <tr>
            <th>Key</th>
            <th>text`key`</th>
            {languages.filter((language) => language !== lang).map((language) => (
              <th key={language}>textByLang('{language}')`key`</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key}>
              <td><code>{key}</code></td>
              <td>{text.hasKey(key) ? text.byKey(key) : <Missing />}</td>
              {languages.filter((language) => language !== lang).map((language) => (
                <td key={language}>
                  {textByLang(language).hasKey(key) ? textByLang(language).byKey(key) : <Missing />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

/**
 * Provides the language and the strings to `useLocalization()`: `lang`, `languages`, `setLanguage`, the `text` tag
 * for the current language and `textByLang(lang)` for another one. `localization` adds strings to (or overrides) the
 * built-in ones; a key missing in a language falls back to the first language.
 *
 * `lang` sets the language whenever it changes; `setLanguage` (the buttons) changes it in between. This story has its
 * own provider, so the Language menu in the toolbar doesn't apply here.
 */
const meta = {
  title: 'Components/Localization/LocalizationProvider',
  component: LocalizationProvider,
  args: {
    lang: 'nl',
    languages: ['en', 'nl', 'fr'],
    localization: {
      en: { welcome: 'Welcome', only_in_english: 'Only in English', save: 'Save changes' },
      nl: { welcome: 'Welkom' },
      fr: { welcome: 'Bienvenue' },
    },
  },
  argTypes: {
    lang: { control: 'inline-radio', options: ['en', 'nl', 'fr'] },
    children: { control: false },
  },
  render: (args) => (
    <LocalizationProvider {...args}>
      <LocalizationState />
    </LocalizationProvider>
  ),
} satisfies Meta<typeof LocalizationProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Without `localization` only the built-in strings are available. */
export const BuiltInStringsOnly: Story = {
  args: { localization: undefined },
};

/**
 * `languages` sets the order of the languages, and the first one is the fallback for missing strings. It can add a
 * language: German has no strings here, so everything falls back to English. Languages in `localization` are always
 * available.
 */
export const ExtraLanguage: Story = {
  args: { languages: ['en', 'nl', 'fr', 'de'], lang: 'de' },
};
