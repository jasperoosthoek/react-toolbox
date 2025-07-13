// Test setup with React Testing Library and jsdom

import '@testing-library/react';
import '@testing-library/jest-dom';

// Mock console to reduce noise during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock react-localization
jest.mock('react-localization', () => {
  return jest.fn().mockImplementation((translations) => {
    const instance = {
      translations,
      currentLanguage: 'en',
      setLanguage: jest.fn(function(lang) {
        this.currentLanguage = lang;
      }),
      getString: jest.fn(function(key, lang) {
        const targetLang = lang || this.currentLanguage;
        if (this.translations && this.translations[targetLang] && this.translations[targetLang][key]) {
          return this.translations[targetLang][key];
        }
        return key;
      }),
      getLanguage: jest.fn(function() {
        return this.currentLanguage;
      }),
      getAvailableLanguages: jest.fn(() => ['en']),
    };
    return instance;
  });
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

// Mock react-bootstrap with proper React elements
jest.mock('react-bootstrap', () => {
  const mockReact = require('react');
  return {
    Button: mockReact.forwardRef((props, ref) => mockReact.createElement('button', { ...props, ref }, props.children)),
    Container: (props) => mockReact.createElement('div', { ...props, className: `container ${props.className || ''}` }, props.children),
    Row: (props) => mockReact.createElement('div', { ...props, className: `row ${props.className || ''}` }, props.children),
    Col: (props) => mockReact.createElement('div', { ...props, className: `col ${props.className || ''}` }, props.children),
    Spinner: (props) => mockReact.createElement('div', { ...props, 'data-testid': 'spinner' }, props.children),
    Badge: (props) => mockReact.createElement('span', { ...props, className: `badge ${props.className || ''}` }, props.children),
    Modal: Object.assign(
      (props) => props.show ? mockReact.createElement('div', { ...props, className: 'modal' }, props.children) : null,
      {
        Header: (props) => mockReact.createElement('div', { ...props, className: 'modal-header' }, props.children),
        Title: (props) => mockReact.createElement('h4', { ...props, className: 'modal-title' }, props.children),
        Body: (props) => mockReact.createElement('div', { ...props, className: 'modal-body' }, props.children),
        Footer: (props) => mockReact.createElement('div', { ...props, className: 'modal-footer' }, props.children)
      }
    ),
    Form: Object.assign(
      (props) => mockReact.createElement('form', props, props.children),
      {
        Group: (props) => mockReact.createElement('div', { ...props, className: 'form-group' }, props.children),
        Label: (props) => mockReact.createElement('label', props, props.children),
        Control: mockReact.forwardRef((props, ref) => {
          const element = props.as || (props.type === 'textarea' ? 'textarea' : 'input');
          return mockReact.createElement(element, { ...props, ref });
        }),
        Select: mockReact.forwardRef((props, ref) => mockReact.createElement('select', { ...props, ref }, props.children)),
        Check: mockReact.forwardRef((props, ref) => mockReact.createElement('input', { ...props, type: 'checkbox', ref })),
        Text: (props) => mockReact.createElement('div', { ...props, className: 'form-text' }, props.children),
      }
    ),
    Table: (props) => mockReact.createElement('table', props, props.children),
    InputGroup: (props) => mockReact.createElement('div', { ...props, className: 'input-group' }, props.children),
    Alert: (props) => mockReact.createElement('div', { ...props, className: 'alert' }, props.children),
    Card: (props) => mockReact.createElement('div', { ...props, className: 'card' }, props.children),
    ButtonGroup: (props) => mockReact.createElement('div', { ...props, className: 'btn-group' }, props.children),
    Dropdown: Object.assign(
      (props) => mockReact.createElement('div', { ...props, className: 'dropdown' }, props.children),
      {
        Toggle: mockReact.forwardRef((props, ref) => {
          const Component = props.as || 'button';
          return mockReact.createElement(Component, { ...props, ref }, props.children);
        }),
        Menu: (props) => mockReact.createElement('div', { ...props, className: 'dropdown-menu' }, props.children),
        Item: (props) => mockReact.createElement('a', { ...props, className: 'dropdown-item' }, props.children),
      }
    ),
    Nav: (props) => mockReact.createElement('nav', props, props.children),
    Navbar: (props) => mockReact.createElement('nav', { ...props, className: 'navbar' }, props.children),
  };
});

// Mock react-icons
jest.mock('react-icons/ai', () => {
  const mockReact = require('react');
  return {
    AiOutlineCheck: () => mockReact.createElement('span', { 'data-testid': 'check-icon' }, '✓'),
    AiOutlineClose: () => mockReact.createElement('span', { 'data-testid': 'close-icon' }, '✗'),
    AiFillCaretDown: () => mockReact.createElement('span', { 'data-testid': 'caret-down' }, '▼'),
    AiFillCaretUp: () => mockReact.createElement('span', { 'data-testid': 'caret-up' }, '▲'),
    AiFillEdit: () => mockReact.createElement('span', { 'data-testid': 'edit-icon' }, '✎'),
    AiOutlinePlus: () => mockReact.createElement('span', { 'data-testid': 'plus-icon' }, '+'),
    AiOutlineUpload: () => mockReact.createElement('span', { 'data-testid': 'upload-icon' }, '↑'),
    AiOutlineDownload: () => mockReact.createElement('span', { 'data-testid': 'download-icon' }, '↓'),
    AiOutlineFileAdd: () => mockReact.createElement('span', { 'data-testid': 'file-add-icon' }, '📄+'),
    AiOutlineFolderAdd: () => mockReact.createElement('span', { 'data-testid': 'folder-add-icon' }, '📁+'),
    AiOutlineArrowRight: () => mockReact.createElement('span', { 'data-testid': 'arrow-right-icon' }, '→'),
    AiOutlineUnlock: () => mockReact.createElement('span', { 'data-testid': 'unlock-icon' }, '🔓'),
    AiOutlineSearch: () => mockReact.createElement('span', { 'data-testid': 'search-icon' }, '🔍'),
    AiOutlineSave: () => mockReact.createElement('span', { 'data-testid': 'save-icon' }, '💾'),
    AiOutlineHome: () => mockReact.createElement('span', { 'data-testid': 'home-icon' }, '🏠'),
  };
});

// Mock other react-icons
jest.mock('react-icons/fi', () => {
  const mockReact = require('react');
  return {
    FiCopy: () => mockReact.createElement('span', { 'data-testid': 'copy-icon' }, '📋'),
  };
});

jest.mock('react-icons/fa', () => {
  const mockReact = require('react');
  return {
    FaTimes: () => mockReact.createElement('span', { 'data-testid': 'times-icon' }, '✕'),
    FaSort: () => mockReact.createElement('span', { 'data-testid': 'sort-icon' }, '↕'),
    FaSortUp: () => mockReact.createElement('span', { 'data-testid': 'sort-up-icon' }, '↑'),
    FaSortDown: () => mockReact.createElement('span', { 'data-testid': 'sort-down-icon' }, '↓'),
    FaRegFlag: () => mockReact.createElement('span', { 'data-testid': 'flag-icon' }, '🚩'),
    FaSyncAlt: () => mockReact.createElement('span', { 'data-testid': 'sync-icon' }, '🔄'),
  };
});

jest.mock('react-icons/cg', () => {
  const mockReact = require('react');
  return {
    CgTrash: () => mockReact.createElement('span', { 'data-testid': 'trash-icon' }, '🗑'),
    CgNotes: () => mockReact.createElement('span', { 'data-testid': 'notes-icon' }, '📝'),
    CgSpinner: () => mockReact.createElement('span', { 'data-testid': 'spinner-icon' }, '⟳'),
  };
});

jest.mock('react-icons/bs', () => {
  const mockReact = require('react');
  return {
    BsArrowsMove: () => mockReact.createElement('span', { 'data-testid': 'arrows-move-icon' }, '⇄'),
    BsCardList: () => mockReact.createElement('span', { 'data-testid': 'card-list-icon' }, '📋'),
    BsPencil: () => mockReact.createElement('span', { 'data-testid': 'pencil-icon' }, '✏'),
  };
});

jest.mock('react-icons/bi', () => {
  const mockReact = require('react');
  return {
    BiRightArrow: () => mockReact.createElement('span', { 'data-testid': 'right-arrow-icon' }, '▶'),
    BiSquare: () => mockReact.createElement('span', { 'data-testid': 'square-icon' }, '⬜'),
    BiHide: () => mockReact.createElement('span', { 'data-testid': 'hide-icon' }, '👁‍🗨'),
    BiShow: () => mockReact.createElement('span', { 'data-testid': 'show-icon' }, '👁'),
  };
});

jest.mock('react-icons/hi', () => {
  const mockReact = require('react');
  return {
    HiOutlineCog: () => mockReact.createElement('span', { 'data-testid': 'cog-icon' }, '⚙'),
    HiOutlineLink: () => mockReact.createElement('span', { 'data-testid': 'link-icon' }, '🔗'),
  };
});

jest.mock('react-icons/vsc', () => {
  const mockReact = require('react');
  return {
    VscMenu: () => mockReact.createElement('span', { 'data-testid': 'menu-icon' }, '☰'),
  };
});

jest.mock('react-icons/ri', () => {
  const mockReact = require('react');
  return {
    RiQuestionnaireLine: () => mockReact.createElement('span', { 'data-testid': 'questionnaire-icon' }, '❓'),
    RiDropdownList: () => mockReact.createElement('span', { 'data-testid': 'dropdown-list-icon' }, '📃'),
    RiResetLeftLine: () => mockReact.createElement('span', { 'data-testid': 'reset-left-icon' }, '↺'),
  };
});

jest.mock('react-icons/lu', () => {
  const mockReact = require('react');
  return {
    LuClipboardPaste: () => mockReact.createElement('span', { 'data-testid': 'clipboard-paste-icon' }, '📋'),
  };
});

// Mock FormModalProvider - using correct path from src/ directory
jest.mock('./components/forms/FormModalProvider', () => ({
  useFormModal: () => ({
    showEditModal: jest.fn(),
    hasProvider: false,
  }),
}));
