// React-free text lookup: safe to import from server code (React Server Components, route handlers, plain Node).
// Nothing in this module or its imports may import React.
import LocalizedStrings from 'localized-strings';
import {
  defaultLocalization,
  AdditionalLocalization,
  LocalizationElement,
  LocalizationFunction,
} from './localization';

export const combineLocalization = (...locals: AdditionalLocalization[]) => {
  if (locals.length === 0) {
    return {} as AdditionalLocalization;
  }

  // Filter out empty objects
  const validLocals = locals.filter(local => local && Object.keys(local).length > 0);

  if (validLocals.length === 0) {
    return {} as AdditionalLocalization;
  }

  // Extract all unique language keys
  const languages = [...new Set(validLocals.flatMap(Object.keys))];

  return languages.reduce(
    (o, lang) => ({
      ...o,
      [lang]: validLocals.reduce<LocalizationElement>(
        (acc, l) => ({ ...acc, ...(l[lang] || {}) }),
        {} as LocalizationElement
      ),
    }),
    {} as AdditionalLocalization
  );
};

export type TextValue = string | number;

/**
 * Template tag that looks up a localized message: text`key` or text`key${a}${b}`. The key is the literal part before
 * the first value (`str[0]`); the values are passed to a function message.
 *
 * Keys are dot paths: "a.b" looks up `a` and then `b`, so a flat key containing a literal dot can't be found.
 */
export type Text = {
  (str: TemplateStringsArray, ...values: TextValue[]): string;
  /** Look up a key built at runtime (the tag only sees `str[0]`, so text`status_${s}` looks up "status_"). */
  byKey: (key: string, ...values: TextValue[]) => string;
  /** True exactly when `byKey(key)` finds a message (in the requested or the default language). Never logs. */
  hasKey: (key: string) => boolean;
  /** The language this snapshot was created for. */
  lang: string;
};

type Message = string | LocalizationFunction;

const hasOwnPath = (object: any, key: string) => {
  for (const part of key.split('.')) {
    if (object === null || typeof object !== 'object' || !Object.prototype.hasOwnProperty.call(object, part)) {
      return false;
    }
    object = object[part];
  }
  return true;
};

/**
 * Format a message the way the provider's `text` always has: a function message must get exactly as many values as
 * it takes, a string message ignores the values.
 */
const formatMessage = (key: string, message: Message, values: TextValue[]): string => {
  if (typeof message === 'function') {
    if (message.length !== values.length) {
      console.error(
        `Language function "${key}" expects exactly ${message.length} argument${message.length === 1 ? '' : 's'}. `
        + (
          message.length > 0
          ? ` Use text${'`'}${key}${'${arg1}${arg2}`'}`
          : ` Use text${'`'}${key}${'`'}`
        )
      );
      return message.length > 0 ? `${key}${'${arg1}${arg2}'}` : key;
    }
    return message(...values);
  }
  return message;
};

/**
 * Create a `text` template tag for one language, without React. The localization is merged with the built-in
 * `defaultLocalization`. A key missing (or `""`) in `lang` falls back to `defaultLanguage`, which defaults to the first
 * language of the merged localization (`en`).
 *
 * The result is a snapshot: it never changes. Create a new one for another language or other strings. Nothing is
 * shared between snapshots, so concurrent server renders in different languages can't affect each other.
 */
export const createText = (
  localization: AdditionalLocalization,
  lang: string,
  defaultLanguage?: string,
): Text => {
  const merged = combineLocalization(defaultLocalization as unknown as AdditionalLocalization, localization);
  const fallbackLanguage = defaultLanguage ?? Object.keys(merged)[0];
  const strings = new LocalizedStrings(merged, { logsEnabled: false });

  const lookupIn = (language: string, key: string): Message | undefined => {
    // getString also walks inherited properties ("toString"), so check own properties first
    if (!hasOwnPath(merged[language], key)) return undefined;
    const message = strings.getString(key, language, true) as unknown as Message | null;
    // A missing value is undefined or "", as the provider has always treated it
    return (typeof message === 'string' && message !== '') || typeof message === 'function' ? message : undefined;
  };

  const lookup = (key: string) => lookupIn(lang, key) ?? lookupIn(fallbackLanguage, key);

  const byKey = (key: string, ...values: TextValue[]) => {
    const message = lookup(key);
    if (message === undefined) {
      console.error(`Language string not found: "${key}"`);
      return key;
    }
    return formatMessage(key, message, values);
  };

  const text = ((str: TemplateStringsArray, ...values: TextValue[]) => byKey(str[0], ...values)) as Text;
  text.byKey = byKey;
  text.hasKey = (key: string) => lookup(key) !== undefined;
  text.lang = lang;
  return text;
};
