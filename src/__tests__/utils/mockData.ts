/**
 * Common mock form fields used across tests
 */
export const MOCK_FORM_FIELDS = {
  // Basic input fields
  username: {
    label: 'Username',
    required: true,
    formProps: { placeholder: 'Enter username', 'data-testid': 'input-field' },
  },
  email: {
    label: 'Email',
    required: false,
    formProps: { type: 'email' },
  },
  password: {
    label: 'Password',
    required: true,
    formProps: { type: 'password' },
  },
  
  // Checkbox fields
  agree: {
    label: 'I agree to terms',
    required: true,
    formProps: { 'data-testid': 'checkbox-field' },
  },
  
  // Select fields
  category: {
    label: 'Category',
    required: true,
    formProps: { 'data-testid': 'dropdown-select' },
  },
  
  // Badge selection fields
  tags: {
    initialValue: [],
    label: 'Tags',
    required: true,
    formProps: {},
  },
  
  // Test fields for general testing
  'test-input': { 
    initialValue: '', 
    required: false, 
    type: 'string' as const
  },
  'test-checkbox': { 
    initialValue: false, 
    required: false, 
    type: 'boolean' as const
  },
  'test-select': { 
    initialValue: '', 
    required: false,
    type: 'select' as const,
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]
  },
  'test-dropdown': {
    initialValue: '',
    required: false,
    type: 'dropdown' as const,
    list: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]
  },
  'test-badges': {
    initialValue: [],
    required: false,
    type: 'badges' as const
  }
};

/**
 * Common mock form values
 */
export const MOCK_FORM_VALUES = {
  basic: {
    username: 'testuser',
    email: 'test@example.com',
    password: '',
  },
  complete: {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpassword',
    agree: true,
    category: 'electronics',
    tags: [1, 2],
  },
  empty: {
    username: '',
    email: '',
    password: '',
    agree: false,
    category: '',
    tags: [],
  }
};

/**
 * Common options for dropdowns and selects
 */
export const MOCK_OPTIONS = {
  badges: [
    { id: 1, name: 'React' },
    { id: 2, name: 'TypeScript' },
    { id: 3, name: 'JavaScript' },
  ],
  categories: [
    { value: '', label: 'Select a category' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
  ],
  stringOptions: ['red', 'green', 'blue'],
  complexOptions: [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B', disabled: true },
    { value: 'c', label: 'Option C' },
  ]
};

/**
 * Modal-specific mock data
 */
export const MOCK_MODAL_DATA = {
  formFields: {
    name: {
      initialValue: '',
      label: 'Name',
      required: true,
      formProps: {},
    },
    email: {
      initialValue: '',
      label: 'Email',
      required: false,
      formProps: { type: 'email' },
    },
  },
  initialState: {
    name: '',
    email: '',
  },
  editStates: {
    user1: { name: 'User 1', email: 'user1@test.com' },
    user2: { name: 'User 2', email: 'user2@test.com' },
  }
};
