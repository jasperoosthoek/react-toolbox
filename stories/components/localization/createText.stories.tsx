import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from 'react-bootstrap';
import { createText } from '../../../src/localization/text';
import type { AdditionalLocalization } from '../../../src/localization/localization';

type CreateTextArgs = {
  localization: AdditionalLocalization;
  lang: string;
  defaultLanguage?: string;
  keys: string[];
};

const CreateTextTable = ({ localization, lang, defaultLanguage, keys }: CreateTextArgs) => {
  const text = createText(localization, lang, defaultLanguage);
  return (
    <>
      <pre className="small bg-light border p-2">
        {`import { createText } from '@jasperoosthoek/react-toolbox/localization';\n\n`}
        {`const text = createText(localization, ${JSON.stringify(lang)}${defaultLanguage ? `, ${JSON.stringify(defaultLanguage)}` : ''});`}
      </pre>
      <Table size="sm" bordered style={{ width: 'auto' }}>
        <thead>
          <tr><th>Key</th><th>text.byKey(key)</th><th>text.hasKey(key)</th></tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key}>
              <td><code>{key}</code></td>
              <td>{text.byKey(key)}</td>
              <td>{String(text.hasKey(key))}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

/**
 * `createText(localization, lang, defaultLanguage?)` from `@jasperoosthoek/react-toolbox/localization` creates the
 * `text` tag without React, for server code such as React Server Components and route handlers. It merges the
 * built-in strings, and a key missing (or `""`) in `lang` falls back to `defaultLanguage` (by default the first
 * language, `en`). An unknown key logs an error and returns the key itself: add one to `keys` to try it.
 */
const meta = {
  title: 'Components/Localization/createText',
  component: CreateTextTable,
  args: {
    localization: {
      en: { welcome: 'Welcome', only_in_english: 'Only in English', empty_in_dutch: 'Not empty in English' },
      nl: { welcome: 'Welkom', empty_in_dutch: '' },
      fr: { welcome: 'Bienvenue' },
    },
    lang: 'nl',
    keys: ['welcome', 'only_in_english', 'empty_in_dutch', 'cancel'],
  },
  argTypes: {
    lang: { control: 'inline-radio', options: ['en', 'nl', 'fr', 'de'] },
    defaultLanguage: { control: 'inline-radio', options: [undefined, 'en', 'nl', 'fr'] },
  },
} satisfies Meta<typeof CreateTextTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A language without strings of its own gets everything from the default language. */
export const UnknownLanguage: Story = {
  args: { lang: 'de' },
};

/** French falls back to Dutch here: "goodbye" only exists in Dutch. */
export const DutchAsDefaultLanguage: Story = {
  args: {
    localization: {
      en: { welcome: 'Welcome' },
      nl: { welcome: 'Welkom', goodbye: 'Tot ziens' },
      fr: { welcome: 'Bienvenue' },
    },
    lang: 'fr',
    defaultLanguage: 'nl',
    keys: ['welcome', 'goodbye', 'cancel'],
  },
};
