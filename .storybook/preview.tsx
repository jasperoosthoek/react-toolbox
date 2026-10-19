import React from 'react';
import type { Preview } from '@storybook/react-vite';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LocalizationProvider } from '../src/localization/LocalizationContext';
import { customStrings } from '../examples/components/LocalizationExamples';

const preview: Preview = {
  globalTypes: {
    lang: {
      description: 'Language of the LocalizationProvider',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'nl', title: 'Nederlands' },
          { value: 'fr', title: 'Français' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    lang: 'en',
  },
  decorators: [
    // The same providers as examples/App.tsx. Every DndProvider with HTML5Backend shares one manager, so a docs page
    // with several stories works.
    (Story, context) => (
      <DndProvider backend={HTML5Backend}>
        <LocalizationProvider lang={context.globals.lang} localization={customStrings}>
          <Story />
        </LocalizationProvider>
      </DndProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    options: {
      storySort: { order: ['Introduction', 'Components', 'Examples'] },
    },
  },
  tags: ['autodocs'],
};

export default preview;
