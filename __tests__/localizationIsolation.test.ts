// The React-free localization modules must work when React can't be used, as in a React Server Component
jest.mock('react', () => ({
  createContext: () => {
    throw new Error('createContext only works in Client Components');
  },
}));
jest.mock('react-localization', () => {
  throw new Error('react-localization must not be imported');
});

describe('React-free localization modules', () => {
  it('src/localization/text.ts imports nothing that needs React', () => {
    const { createText } = require('../src/localization/text');
    expect(createText({}, 'nl')`cancel`).toBe('Annuleren');
  });

  it('src/localization/standalone.ts (the /localization entry) imports nothing that needs React', () => {
    const entry = require('../src/localization/standalone');
    expect(Object.keys(entry).sort()).toEqual(
      ['combineLocalization', 'createText', 'defaultLanguages', 'defaultLocalization'].sort()
    );
    expect(entry.createText(entry.defaultLocalization, 'fr')`ok`).toBe(entry.defaultLocalization.fr.ok);
  });

  it('the main entry does need React (so the mocks above are effective)', () => {
    expect(() => require('../src/localization/LocalizationContext')).toThrow();
  });
});
