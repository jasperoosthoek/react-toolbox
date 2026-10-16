import { createText, combineLocalization } from '../src/localization/text';

const localization = {
  en: {
    hello: 'Hello',
    only_en: 'Only English',
    empty_nl: 'Not empty in English',
    greet: (name: string | number) => `Hello ${name}`,
    no_args: () => 'No arguments',
    status_open: 'Open',
    nested: { inner: 'Inner' } as any,
  },
  nl: {
    hello: 'Hallo',
    empty_nl: '',
    greet: (name: string | number) => `Hallo ${name}`,
    status_open: 'Geopend',
  },
};

let errorSpy: jest.SpyInstance;
beforeEach(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  errorSpy.mockRestore();
});

describe('createText', () => {
  it('looks up a key in the requested language', () => {
    expect(createText(localization, 'en')`hello`).toBe('Hello');
    expect(createText(localization, 'nl')`hello`).toBe('Hallo');
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('passes values to a function message', () => {
    const name = 'Jan';
    expect(createText(localization, 'en')`greet${name}`).toBe('Hello Jan');
    expect(createText(localization, 'nl')`greet${name}`).toBe('Hallo Jan');
    expect(createText(localization, 'en')`no_args`).toBe('No arguments');
  });

  it('merges the built-in strings', () => {
    expect(createText(localization, 'nl')`cancel`).toBe('Annuleren');
    expect(createText({}, 'nl')`cancel`).toBe('Annuleren');
    expect(createText({}, 'fr')`cancel`).toBe('Annuler');
  });

  it('lets the localization override built-in strings', () => {
    expect(createText({ en: { cancel: 'Never mind' } }, 'en')`cancel`).toBe('Never mind');
  });

  it('keeps two languages apart when used interleaved', () => {
    const en = createText(localization, 'en');
    const nl = createText(localization, 'nl');
    expect([en`hello`, nl`hello`, en`hello`, nl`greet${1}`]).toEqual(['Hello', 'Hallo', 'Hello', 'Hallo 1']);
    expect(en.lang).toBe('en');
    expect(nl.lang).toBe('nl');
  });

  describe('fallback', () => {
    it('falls back to the first language of the merged localization (en) by default', () => {
      expect(createText(localization, 'nl')`only_en`).toBe('Only English');
      expect(createText({ en: { x: 'X' } }, 'de')`x`).toBe('X');
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('falls back to an explicit default language', () => {
      const loc = { en: { a: 'A en' }, nl: { a: 'A nl', b: 'B nl' }, fr: {} };
      expect(createText(loc, 'fr', 'nl')`a`).toBe('A nl');
      expect(createText(loc, 'fr', 'nl')`b`).toBe('B nl');
      // b is missing in fr and in en (the default default language)
      expect(createText(loc, 'fr')`b`).toBe('b');
      expect(errorSpy).toHaveBeenCalledWith('Language string not found: "b"');
    });

    it('treats "" as missing and falls back', () => {
      expect(createText(localization, 'nl')`empty_nl`).toBe('Not empty in English');
      expect(createText({ en: { e: '' } }, 'en')`e`).toBe('e');
      expect(errorSpy).toHaveBeenCalledWith('Language string not found: "e"');
    });
  });

  describe('byKey', () => {
    it('looks up a key built at runtime', () => {
      const text = createText(localization, 'nl');
      const status = 'open';
      expect(text.byKey(`status_${status}`)).toBe('Geopend');
      expect(text.byKey('greet', 'Piet')).toBe('Hallo Piet');
    });

    it('supports dot paths', () => {
      expect(createText(localization, 'en').byKey('nested.inner')).toBe('Inner');
    });
  });

  describe('hasKey', () => {
    const text = createText(localization, 'nl');

    it('is true for a key in the requested language', () => {
      expect(text.hasKey('hello')).toBe(true);
    });

    it('is true for a key only in the default language, which the lookup translates', () => {
      expect(text.hasKey('only_en')).toBe(true);
      expect(text.byKey('only_en')).toBe('Only English');
    });

    it('is true for "" in the requested language when the default language has the key', () => {
      expect(text.hasKey('empty_nl')).toBe(true);
    });

    it('is false for an unknown key, an object, an inherited property or a flat key with a dot, without logging', () => {
      expect(text.hasKey('unknown')).toBe(false);
      expect(text.hasKey('nested')).toBe(false);
      expect(text.hasKey('toString')).toBe(false);
      expect(text.hasKey('constructor')).toBe(false);
      expect(text.hasKey('vacancy not found.')).toBe(false);
      expect(createText({ en: { e: '' } }, 'en').hasKey('e')).toBe(false);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('errors (same as the provider has always done)', () => {
    it('logs and returns the key for an unknown key', () => {
      expect(createText(localization, 'en')`unknown`).toBe('unknown');
      expect(errorSpy).toHaveBeenCalledWith('Language string not found: "unknown"');
    });

    it('treats inherited properties as unknown keys', () => {
      expect(createText(localization, 'en')`toString`).toBe('toString');
      expect(errorSpy).toHaveBeenCalledWith('Language string not found: "toString"');
    });

    it('logs and returns the key with placeholders when a function gets the wrong number of values', () => {
      expect(createText(localization, 'en')`greet`).toBe('greet${arg1}${arg2}');
      expect(errorSpy).toHaveBeenCalledWith(
        'Language function "greet" expects exactly 1 argument.  Use text`greet${arg1}${arg2}`'
      );
    });

    it('logs and returns the key alone when a function without arguments gets values', () => {
      expect(createText(localization, 'en')`no_args${1}`).toBe('no_args');
      expect(errorSpy).toHaveBeenCalledWith(
        'Language function "no_args" expects exactly 0 arguments.  Use text`no_args`'
      );
    });

    it('ignores values given to a string message', () => {
      expect(createText(localization, 'en')`hello${1}${2}`).toBe('Hello');
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  it('does not change the localization passed in', () => {
    const loc = { en: { a: 'A' } };
    const before = JSON.stringify(loc);
    createText(loc, 'en');
    expect(JSON.stringify(loc)).toBe(before);
  });
});

describe('combineLocalization from the React-free module', () => {
  it('merges per language, last one wins', () => {
    expect(combineLocalization({ en: { a: '1', b: '1' } }, { en: { b: '2' }, nl: { a: '3' } }))
      .toEqual({ en: { a: '1', b: '2' }, nl: { a: '3' } });
  });
});
