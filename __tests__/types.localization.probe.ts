// Compiled by types.test.ts (tsc --noEmit, strict): localization objects as consumers write them must type-check
// without casts.
import { createText } from '../src/localization/text';
import type { AdditionalLocalization } from '../src/localization/localization';

// Functions with typed parameters, as in the README
export const localization: AdditionalLocalization = {
  en: {
    greeting: (name: string) => `Hello ${name}`,
    user_count: (count: number) => `${count} users`,
    notification: (type: string, message: string) => `${type}: ${message}`,
    no_args: () => 'No arguments',
    plain: 'Plain',
    // Nested messages, looked up with a dot path: text.byKey('status.open')
    status: {
      open: 'Open',
      closed: 'Closed',
      days_open: (days: number) => `Open for ${days} days`,
    },
  },
};

const text = createText(localization, 'en');
export const out: string = text.byKey('status.open') + text`greeting${'Jan'}`;
