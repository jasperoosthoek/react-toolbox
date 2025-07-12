// Test setup with React Testing Library and jsdom

import '@testing-library/react';
import '@testing-library/jest-dom';

// Mock console to reduce noise during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock axios for all tests
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock react-localization
jest.mock('react-localization', () => {
  return jest.fn().mockImplementation((translations) => ({
    setLanguage: jest.fn(),
    getString: jest.fn((key, lang) => key || 'mock_string'),
    getLanguage: jest.fn(() => 'en'),
    getAvailableLanguages: jest.fn(() => ['en']),
  }));
});

// Mock react-dnd
jest.mock('react-dnd', () => ({
  useDrag: jest.fn(() => [{}, jest.fn(), jest.fn()]),
  useDrop: jest.fn(() => [{}, jest.fn()]),
  DndProvider: ({ children }) => children,
  useDragLayer: jest.fn(() => ({})),
}));

// Mock react-dnd-html5-backend
jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: 'HTML5Backend',
}));

// Mock react-bootstrap
jest.mock('react-bootstrap', () => ({
  Button: 'button',
  Container: 'div',
  Row: 'div', 
  Col: 'div',
  Spinner: 'div',
  Badge: 'span',
  Modal: 'div',
  Form: {
    Group: 'div',
    Label: 'label',
    Control: 'input',
    Select: 'select',
    Check: 'input',
    Text: 'div',
  },
  Table: 'table',
  InputGroup: 'div',
  Alert: 'div',
  Card: 'div',
  Dropdown: 'div',
  Nav: 'div',
  Navbar: 'div',
}));

// Mock react-icons
jest.mock('react-icons/ai', () => ({
  AiOutlineCheck: 'span',
  AiOutlineClose: 'span',
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => 'mocked-date'),
  parseISO: jest.fn((dateStr) => new Date(dateStr)),
  isValid: jest.fn(() => true),
}));

// Mock date-fns-tz
jest.mock('date-fns-tz', () => ({
  zonedTimeToUtc: jest.fn((date, timezone) => date),
  utcToZonedTime: jest.fn((date, timezone) => date),
  format: jest.fn((date, formatStr, options) => 'mocked-date'),
}));
