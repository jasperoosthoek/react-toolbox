import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { 
  LocalizationProvider, 
  LocalizationContext,
  useLocalization,
  combineLocalization 
} from '../src/localization/LocalizationContext';
import { 
  defaultLocalization, 
  defaultLanguages 
} from '../src/localization/localization';
import { createText, Text } from '../src/localization/text';

describe('Localization Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('defaultLocalization and defaultLanguages', () => {
    it('should export default languages', () => {
      expect(defaultLanguages).toBeDefined();
      expect(defaultLanguages.en).toBe('English');
      expect(defaultLanguages.fr).toBe('Français');
      expect(defaultLanguages.nl).toBe('Nederlands');
    });

    it('should export default localization strings', () => {
      expect(defaultLocalization).toBeDefined();
      expect(defaultLocalization.en).toBeDefined();
      expect(defaultLocalization.fr).toBeDefined();
      expect(defaultLocalization.nl).toBeDefined();
    });

    it('should have consistent keys across all languages', () => {
      const englishKeys = Object.keys(defaultLocalization.en);
      const frenchKeys = Object.keys(defaultLocalization.fr);
      const dutchKeys = Object.keys(defaultLocalization.nl);

      expect(frenchKeys).toEqual(englishKeys);
      expect(dutchKeys).toEqual(englishKeys);
    });

    it('should have all required localization keys', () => {
      const requiredKeys = [
        'select',
        'search',
        'no_information_to_display',
        'information_is_being_loaded',
        'delete',
        'are_you_sure',
        'close',
        'save',
        'cancel',
        'ok',
        'login',
        'error_required_field',
        'choose_one',
        'everything',
        'number_of_rows',
      ];

      requiredKeys.forEach(key => {
        expect(defaultLocalization.en[key]).toBeDefined();
        expect(defaultLocalization.fr[key]).toBeDefined();
        expect(defaultLocalization.nl[key]).toBeDefined();
      });
    });
  });

  describe('combineLocalization', () => {
    it('should combine multiple localization objects', () => {
      const additional1 = {
        en: { custom_key_1: 'Custom 1' },
        fr: { custom_key_1: 'Personnalisé 1' },
      };

      const additional2 = {
        en: { custom_key_2: 'Custom 2' },
        fr: { custom_key_2: 'Personnalisé 2' },
        es: { custom_key_2: 'Personalizado 2' },
      };

      const result = combineLocalization(additional1, additional2);

      expect(result).toEqual({
        en: { 
          custom_key_1: 'Custom 1',
          custom_key_2: 'Custom 2'
        },
        fr: { 
          custom_key_1: 'Personnalisé 1',
          custom_key_2: 'Personnalisé 2'
        },
        es: { 
          custom_key_2: 'Personalizado 2'
        }
      });
    });

    it('should handle overlapping keys (last one wins)', () => {
      const first = {
        en: { shared_key: 'First Value' },
      };

      const second = {
        en: { shared_key: 'Second Value' },
      };

      const result = combineLocalization(first, second);

      expect(result.en.shared_key).toBe('Second Value');
    });

    it('should handle empty localization objects', () => {
      const result = combineLocalization({}, {});
      expect(result).toEqual({});
    });

    it('should extract unique language keys', () => {
      const loc1 = { en: { key1: 'value1' } };
      const loc2 = { fr: { key2: 'value2' } };
      const loc3 = { es: { key3: 'value3' } };

      const result = combineLocalization(loc1, loc2, loc3);

      expect(Object.keys(result)).toEqual(['en', 'fr', 'es']);
    });
  });

  describe('LocalizationProvider', () => {
    it('should render with default props', () => {
      expect(() => {
        render(
          <LocalizationProvider>
            <div>Test Content</div>
          </LocalizationProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom language', () => {
      expect(() => {
        render(
          <LocalizationProvider lang="fr">
            <div>Test Content</div>
          </LocalizationProvider>
        );
      }).not.toThrow();
    });

    it('should render with additional localization', () => {
      const additionalLoc = {
        en: { custom_key: 'Custom English' },
        fr: { custom_key: 'Français personnalisé' },
      };

      expect(() => {
        render(
          <LocalizationProvider 
            lang="en"
            localization={additionalLoc}
          >
            <div>Test Content</div>
          </LocalizationProvider>
        );
      }).not.toThrow();
    });

    it('should render with custom languages', () => {
      const customLanguages = ['en', 'es', 'de'];

      expect(() => {
        render(
          <LocalizationProvider 
            languages={customLanguages}
          >
            <div>Test Content</div>
          </LocalizationProvider>
        );
      }).not.toThrow();
    });

    it('should render with all props', () => {
      const additionalLoc = {
        en: { custom: 'Custom' },
        es: { custom: 'Personalizado' },
      };

      expect(() => {
        render(
          <LocalizationProvider 
            lang="es"
            localization={additionalLoc}
            languages={['en', 'es']}
            customProp="test"
          >
            <div>Test Content</div>
          </LocalizationProvider>
        );
      }).not.toThrow();
    });
  });

  describe('useLocalization Hook', () => {
    it('should provide localization context', () => {
      const TestComponent = () => {
        const { lang, strings, text, setLanguage } = useLocalization();
        
        return (
          <div>
            <span data-testid="current-lang">{lang}</span>
            <span data-testid="close-string">{strings.getString('close')}</span>
            <button onClick={() => setLanguage('fr')} data-testid="change-lang">
              Change Language
            </button>
          </div>
        );
      };

      const { getByTestId } = render(
        <LocalizationProvider lang="en">
          <TestComponent />
        </LocalizationProvider>
      );

      expect(getByTestId('current-lang')).toHaveTextContent('en');
      expect(getByTestId('close-string')).toHaveTextContent('Close');
    });

    it('should handle language changes', () => {
      const TestComponent = () => {
        const { lang, setLanguage, languages } = useLocalization();
        
        return (
          <div>
            <span data-testid="current-lang">{lang}</span>
            <span data-testid="available-langs">{languages.join(',')}</span>
            <button onClick={() => setLanguage('fr')} data-testid="set-french">
              Set French
            </button>
            <button onClick={() => setLanguage('invalid')} data-testid="set-invalid">
              Set Invalid
            </button>
          </div>
        );
      };

      const { getByTestId } = render(
        <LocalizationProvider lang="en">
          <TestComponent />
        </LocalizationProvider>
      );

      expect(getByTestId('current-lang')).toHaveTextContent('en');
      
      fireEvent.click(getByTestId('set-french'));
      expect(getByTestId('current-lang')).toHaveTextContent('fr');

      // Should not change to invalid language
      fireEvent.click(getByTestId('set-invalid'));
      expect(getByTestId('current-lang')).toHaveTextContent('fr');
    });

    it('should provide text function for template literals', () => {
      const TestComponent = () => {
        const { text } = useLocalization();
        
        return (
          <div>
            <span data-testid="text-result">
              {text`close`}
            </span>
          </div>
        );
      };

      const { getByTestId } = render(
        <LocalizationProvider>
          <TestComponent />
        </LocalizationProvider>
      );

      expect(getByTestId('text-result')).toHaveTextContent('Close');
    });

    it('should provide textByLang function', () => {
      const TestComponent = () => {
        const { textByLang } = useLocalization();
        
        return (
          <div>
            <span data-testid="english-text">
              {textByLang('en')`close`}
            </span>
            <span data-testid="french-text">
              {textByLang('fr')`close`}
            </span>
          </div>
        );
      };

      const { getByTestId } = render(
        <LocalizationProvider>
          <TestComponent />
        </LocalizationProvider>
      );

      expect(getByTestId('english-text')).toHaveTextContent('Close');
      expect(getByTestId('french-text')).toHaveTextContent('Fermer');
    });

    it('should handle setLocalization function', () => {
      const TestComponent = () => {
        const { setLocalization, strings } = useLocalization();
        
        const addCustomLocalization = () => {
          setLocalization({
            en: { custom_key: 'Custom Value' }
          });
        };
        
        return (
          <div>
            <button onClick={addCustomLocalization} data-testid="add-custom">
              Add Custom
            </button>
            <span data-testid="custom-value">
              {strings.getString('custom_key') || 'Not Found'}
            </span>
          </div>
        );
      };

      const { getByTestId } = render(
        <LocalizationProvider>
          <TestComponent />
        </LocalizationProvider>
      );

      expect(getByTestId('custom-value')).toHaveTextContent('custom_key');
      
      fireEvent.click(getByTestId('add-custom'));
      expect(getByTestId('custom-value')).toHaveTextContent('Custom Value');
    });
  });

  describe('LocalizationContext Error Handling', () => {
    it('should handle context usage outside provider', () => {
      const TestComponent = () => {
        const { setLanguage, text, textByLang, setLocalization } = useLocalization();
        
        return (
          <div>
            <button onClick={() => setLanguage('en')} data-testid="set-lang">
              Set Language
            </button>
            <button onClick={() => text`test`} data-testid="text">
              Text
            </button>
            <button onClick={() => textByLang('en')`test`} data-testid="text-by-lang">
              Text By Lang
            </button>
            <button onClick={() => setLocalization({})} data-testid="set-localization">
              Set Localization
            </button>
          </div>
        );
      };

      // Mock console.error to capture error messages
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { getByTestId } = render(<TestComponent />);

      fireEvent.click(getByTestId('set-lang'));
      fireEvent.click(getByTestId('text'));
      fireEvent.click(getByTestId('text-by-lang'));
      fireEvent.click(getByTestId('set-localization'));

      expect(consoleSpy).toHaveBeenCalledWith(
        'This function should only be used in a child of LocalizationProvider.'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Advanced Localization Features', () => {
    it('should handle function-based localization strings', () => {
      const customLocalization = {
        en: {
          greeting: (name: string) => `Hello, ${name}!`,
          count: (num: number) => `You have ${num} item${num !== 1 ? 's' : ''}`,
        }
      };

      const TestComponent = () => {
        const { textByLang } = useLocalization();
        
        return (
          <div>
            <span data-testid="greeting">
              {textByLang('en')`greeting`}
            </span>
            <span data-testid="count">
              {textByLang('en')`count`}
            </span>
          </div>
        );
      };

      const { getByTestId } = render(
        <LocalizationProvider localization={customLocalization}>
          <TestComponent />
        </LocalizationProvider>
      );

      // Since we're testing the template literal syntax, these should return the key names
      expect(getByTestId('greeting')).toHaveTextContent('greeting');
      expect(getByTestId('count')).toHaveTextContent('count');
    });

    it('should handle missing localization keys', () => {
      const TestComponent = () => {
        const { strings, textByLang } = useLocalization();
        
        return (
          <div>
            <span data-testid="missing-string">
              {strings.getString('non_existent_key')}
            </span>
            <span data-testid="missing-text">
              {textByLang('en')`non_existent_key`}
            </span>
          </div>
        );
      };

      const { getByTestId } = render(
        <LocalizationProvider>
          <TestComponent />
        </LocalizationProvider>
      );

      expect(getByTestId('missing-text')).toHaveTextContent('non_existent_key');
    });
  });

  describe('Component Export Verification', () => {
    it('should export all localization components and functions', () => {
      expect(typeof LocalizationProvider).toBe('function');
      expect(typeof LocalizationContext).toBe('object');
      expect(typeof useLocalization).toBe('function');
      expect(typeof combineLocalization).toBe('function');
    });

    it('should export localization data', () => {
      expect(typeof defaultLocalization).toBe('object');
      expect(typeof defaultLanguages).toBe('object');
    });
  });

  describe('Provider built on createText', () => {
    const loc = {
      en: { hello: 'Hello', greet: (n: string | number) => `Hi ${n}`, only_en: 'Only English' },
      nl: { hello: 'Hallo', greet: (n: string | number) => `Hoi ${n}` },
      de: { hello: 'Hallo auf Deutsch' },
    };

    const Show = ({ k }: { k: string }) => {
      const { text } = useLocalization();
      return <span data-testid={k}>{text.byKey(k)}</span>;
    };

    it('gives the same results as createText, including the error cases', () => {
      const cases: [string, (string | number)[]][] = [
        ['hello', []], ['hello', [1]], ['greet', ['x']], ['greet', []], ['only_en', []], ['unknown', []], ['cancel', []],
      ];
      const run = (text: Text) => cases.map(([key, values]) => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const result = text.byKey(key, ...values);
        const calls = spy.mock.calls;
        spy.mockRestore();
        return [result, calls];
      });

      let fromProvider: any[] = [];
      const Probe = () => {
        fromProvider = run(useLocalization().text);
        return null;
      };
      render(<LocalizationProvider lang="nl" localization={loc}><Probe /></LocalizationProvider>);

      expect(fromProvider).toEqual(run(createText(loc, 'nl')));
    });

    it('textByLang gives the requested language, not the current one', () => {
      const Probe = () => {
        const { textByLang } = useLocalization();
        return <span data-testid="de">{textByLang('de')`hello`}</span>;
      };
      const { getByTestId } = render(
        <LocalizationProvider lang="en" localization={loc}><Probe /></LocalizationProvider>
      );
      expect(getByTestId('de')).toHaveTextContent('Hallo auf Deutsch');
    });

    it('exposes byKey and hasKey on text', () => {
      const Probe = () => {
        const { text } = useLocalization();
        const status = 'hello';
        return <span data-testid="out">{`${text.byKey(status)} ${text.hasKey('only_en')} ${text.hasKey('nope')}`}</span>;
      };
      const { getByTestId } = render(
        <LocalizationProvider lang="nl" localization={loc}><Probe /></LocalizationProvider>
      );
      expect(getByTestId('out')).toHaveTextContent('Hallo true false');
    });

    it('falls back to the first of its languages', () => {
      const { getByTestId } = render(
        <LocalizationProvider lang="en" languages={['nl', 'en']} localization={{ nl: { only_nl: 'Alleen Nederlands' } }}>
          <Show k="only_nl" />
        </LocalizationProvider>
      );
      expect(getByTestId('only_nl')).toHaveTextContent('Alleen Nederlands');
    });

    it('falls back to English for a key missing in the current language', () => {
      const { getByTestId } = render(
        <LocalizationProvider lang="nl" localization={loc}><Show k="only_en" /></LocalizationProvider>
      );
      expect(getByTestId('only_en')).toHaveTextContent('Only English');
    });
  });

  describe('A language that is not available', () => {
    const Probe = () => {
      const { lang, text, strings } = useLocalization();
      return <span data-testid="out">{`${lang} ${text`cancel`} ${strings.getString('cancel')}`}</span>;
    };
    let errorSpy: jest.SpyInstance;
    beforeEach(() => {
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      errorSpy.mockRestore();
    });

    it('uses the first language when languages leaves out the default en, without an error', () => {
      const { getByTestId } = render(<LocalizationProvider languages={['nl']}><Probe /></LocalizationProvider>);
      expect(getByTestId('out')).toHaveTextContent('nl Annuleren Annuleren');
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('uses the first language for a lang prop that is not available and logs an error', () => {
      const { getByTestId } = render(<LocalizationProvider lang="de"><Probe /></LocalizationProvider>);
      expect(getByTestId('out')).toHaveTextContent('en Cancel Cancel');
      expect(errorSpy).toHaveBeenCalledWith('Language de not available');
    });

    it('reconciles a lang prop that changes to an unavailable language', () => {
      const { getByTestId, rerender } = render(
        <LocalizationProvider lang="fr" languages={['nl', 'fr']}><Probe /></LocalizationProvider>
      );
      expect(getByTestId('out')).toHaveTextContent('fr Annuler Annuler');
      rerender(<LocalizationProvider lang="es" languages={['nl', 'fr']}><Probe /></LocalizationProvider>);
      expect(getByTestId('out')).toHaveTextContent('nl Annuleren Annuleren');
      expect(errorSpy).toHaveBeenCalledWith('Language es not available');
    });
  });

  describe('Provider props after the first render', () => {
    // A child with its own state, to detect remounts
    const Child = () => {
      const { text, setLanguage, setLocalization } = useLocalization();
      const [clicks, setClicks] = React.useState(0);
      return (
        <div>
          <span data-testid="cancel">{text`cancel`}</span>
          <span data-testid="custom">{text.hasKey('custom') ? text`custom` : '-'}</span>
          <span data-testid="clicks">{clicks}</span>
          <button data-testid="click" onClick={() => setClicks(clicks + 1)} />
          <button data-testid="to-nl" onClick={() => setLanguage('nl')} />
          <button data-testid="add" onClick={() => setLocalization({ en: { added: 'Added' }, nl: { added: 'Toegevoegd' } })} />
          <span data-testid="added">{text.hasKey('added') ? text`added` : '-'}</span>
        </div>
      );
    };

    it('follows a changed lang prop without remounting children', () => {
      const { getByTestId, rerender } = render(<LocalizationProvider lang="en"><Child /></LocalizationProvider>);
      fireEvent.click(getByTestId('click'));
      expect(getByTestId('cancel')).toHaveTextContent('Cancel');

      rerender(<LocalizationProvider lang="nl"><Child /></LocalizationProvider>);
      expect(getByTestId('cancel')).toHaveTextContent('Annuleren');
      expect(getByTestId('clicks')).toHaveTextContent('1');
    });

    it('keeps a language set with setLanguage when rerendered with the same lang prop', () => {
      const { getByTestId, rerender } = render(<LocalizationProvider lang="en"><Child /></LocalizationProvider>);
      fireEvent.click(getByTestId('to-nl'));
      expect(getByTestId('cancel')).toHaveTextContent('Annuleren');

      rerender(<LocalizationProvider lang="en"><Child /></LocalizationProvider>);
      expect(getByTestId('cancel')).toHaveTextContent('Annuleren');
    });

    it('follows a new localization prop', () => {
      const { getByTestId, rerender } = render(
        <LocalizationProvider lang="en" localization={{ en: { custom: 'First' } }}><Child /></LocalizationProvider>
      );
      expect(getByTestId('custom')).toHaveTextContent('First');

      rerender(
        <LocalizationProvider lang="en" localization={{ en: { custom: 'Second', cancel: 'Stop' } }}><Child /></LocalizationProvider>
      );
      expect(getByTestId('custom')).toHaveTextContent('Second');
      expect(getByTestId('cancel')).toHaveTextContent('Stop');
    });

    it('keeps setLocalization additions when rerendered with a new (equal) inline localization object', () => {
      const { getByTestId, rerender } = render(
        <LocalizationProvider lang="en" localization={{ en: { custom: 'Custom' } }}><Child /></LocalizationProvider>
      );
      fireEvent.click(getByTestId('add'));
      expect(getByTestId('added')).toHaveTextContent('Added');

      rerender(<LocalizationProvider lang="en" localization={{ en: { custom: 'Custom' } }}><Child /></LocalizationProvider>);
      expect(getByTestId('added')).toHaveTextContent('Added');
      expect(getByTestId('custom')).toHaveTextContent('Custom');

      rerender(<LocalizationProvider lang="nl" localization={{ en: { custom: 'Custom' } }}><Child /></LocalizationProvider>);
      expect(getByTestId('added')).toHaveTextContent('Toegevoegd');
    });

    it('keeps the identity of text and textByLang across rerenders without a localization prop', () => {
      const effect = jest.fn();
      const seen = new Set<unknown>();
      const Probe = () => {
        const { text, textByLang } = useLocalization();
        seen.add(textByLang);
        React.useEffect(() => { effect(); }, [text]);
        return null;
      };
      const { rerender } = render(<LocalizationProvider lang="en" languages={['en', 'nl']}><Probe /></LocalizationProvider>);
      rerender(<LocalizationProvider lang="en" languages={['en', 'nl']}><Probe /></LocalizationProvider>);
      rerender(<LocalizationProvider lang="en" languages={['en', 'nl']}><Probe /></LocalizationProvider>);

      expect(effect).toHaveBeenCalledTimes(1);
      expect(seen.size).toBe(1);
    });

    it('keeps the identity of text with a hoisted localization object', () => {
      const effect = jest.fn();
      const hoisted = { en: { custom: 'Custom' } };
      const Probe = () => {
        const { text } = useLocalization();
        React.useEffect(() => { effect(); }, [text]);
        return null;
      };
      const { rerender } = render(<LocalizationProvider localization={hoisted}><Probe /></LocalizationProvider>);
      rerender(<LocalizationProvider localization={hoisted}><Probe /></LocalizationProvider>);
      expect(effect).toHaveBeenCalledTimes(1);
    });
  });
});

