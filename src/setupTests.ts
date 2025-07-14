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
    Button: mockReact.forwardRef((props, ref) => {
      const { variant, size, className = '', ...restProps } = props;
      let classes = 'btn';
      if (variant) classes += ` btn-${variant}`;
      if (size) classes += ` btn-${size}`;
      if (className) classes += ` ${className}`;
      
      return mockReact.createElement('button', { 
        ...restProps, 
        ref, 
        className: classes.trim()
      }, props.children);
    }),
    Container: (props) => mockReact.createElement('div', { ...props, className: `container ${props.className || ''}` }, props.children),
    Row: (props) => mockReact.createElement('div', { ...props, className: `row ${props.className || ''}` }, props.children),
    Col: (props) => mockReact.createElement('div', { ...props, className: `col ${props.className || ''}` }, props.children),
    Spinner: (props) => mockReact.createElement('div', { ...props, 'data-testid': 'spinner' }, props.children),
    Badge: (props) => mockReact.createElement('span', { ...props, className: `badge ${props.className || ''}` }, props.children),
    Modal: Object.assign(
      (props) => {
        if (!props.show) return null;
        
        const modalElement = mockReact.createElement('div', { 
          ...props, 
          className: 'modal',
          role: props.role || 'dialog'
        }, 
          // Clone children and pass onHide to Modal.Header
          mockReact.Children.map(props.children, (child) => {
            if (child && child.type && child.type.displayName === 'Modal.Header') {
              return mockReact.cloneElement(child, { onHide: props.onHide });
            }
            return child;
          })
        );
        
        return modalElement;
      },
      {
        Header: Object.assign(
          (props) => {
            const headerContent = mockReact.createElement('div', { 
              key: 'header-content',
              className: 'modal-header' 
            }, [
              props.children,
              // Add close button if closeButton prop is true
              props.closeButton && mockReact.createElement('button', {
                key: 'close-button',
                type: 'button',
                className: 'btn-close',
                'aria-label': 'Close',
                onClick: props.onHide, // Wire up the close button to onHide
                children: 'Close' // Accessible text for testing
              })
            ].filter(Boolean));
            
            return headerContent;
          },
          { displayName: 'Modal.Header' }
        ),
        Title: (props) => mockReact.createElement('h4', { ...props, className: 'modal-title' }, props.children),
        Body: (props) => mockReact.createElement('div', { ...props, className: 'modal-body' }, props.children),
        Footer: (props) => mockReact.createElement('div', { ...props, className: 'modal-footer' }, props.children)
      }
    ),
    Form: Object.assign(
      (props) => mockReact.createElement('form', props, props.children),
      {
        Group: (props) => {
          const { controlId, ...restProps } = props;
          return mockReact.createElement('div', { 
            ...restProps, 
            className: 'form-group'
          }, props.children);
        },
        Label: (props) => mockReact.createElement('label', { 
          ...props,
          htmlFor: props.htmlFor || undefined
        }, props.children),
        Control: mockReact.forwardRef((props, ref) => {
          const element = props.as || (props.type === 'textarea' ? 'textarea' : 'input');
          const { isInvalid, className = '', ...restProps } = props;
          let classes = className;
          if (isInvalid) {
            classes += (classes ? ' ' : '') + 'is-invalid';
          }
          const controlProps = { 
            ...restProps, 
            ref,
            id: props.id || undefined,
            className: classes.trim() || undefined
          };
          // Add default type="text" for input elements if not specified
          if (element === 'input' && !controlProps.type) {
            controlProps.type = 'text';
          }
          return mockReact.createElement(element, controlProps);
        }),
        Select: mockReact.forwardRef((props, ref) => {
          const { isInvalid, className = '', ...restProps } = props;
          let classes = className;
          if (isInvalid) {
            classes += (classes ? ' ' : '') + 'is-invalid';
          }
          return mockReact.createElement('select', { 
            ...restProps, 
            ref,
            className: classes.trim() || undefined
          }, props.children);
        }),
        Check: mockReact.forwardRef((props, ref) => {
          const { label, type, checked, isInvalid, className = '', id, ...restProps } = props;
          let classes = 'form-check-input';
          if (isInvalid) {
            classes += ' is-invalid';
          }
          if (className) {
            classes += ` ${className}`;
          }
          
          const checkboxId = id || 'checkbox';
          
          return mockReact.createElement('div', { className: 'form-check' }, [
            mockReact.createElement('input', {
              key: 'input',
              ...restProps,
              ref,
              type: type === 'switch' ? 'checkbox' : (type || 'checkbox'),
              className: classes.trim(),
              checked: !!checked,
              id: checkboxId
            }),
            label && mockReact.createElement('label', {
              key: 'label',
              className: 'form-check-label',
              htmlFor: checkboxId
            }, label)
          ]);
        }),
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

// Let LocalizationContext tests run against the real implementation
// Only mock specific tests that need different behavior
