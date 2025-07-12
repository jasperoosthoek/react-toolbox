// Mock for react-localization
const LocalizedStrings = jest.fn().mockImplementation((translations) => ({
  setLanguage: jest.fn(),
  getString: jest.fn((key, lang) => key || 'mock_string'),
  getLanguage: jest.fn(() => 'en'),
  getAvailableLanguages: jest.fn(() => ['en']),
  formatString: jest.fn((str, ...values) => str),
}));

module.exports = LocalizedStrings;
