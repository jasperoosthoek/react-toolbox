# React Toolbox

A comprehensive library of React components that integrates seamlessly with [react-bootstrap](https://react-bootstrap.github.io/). Build modern, interactive applications faster with pre-built, customizable components.

**[Live Dashboard Demo](https://dashboard-demo-olive-eight.vercel.app/employees)** | **[Dashboard Demo Source](https://github.com/jasperoosthoek/dashboard-demo)**

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Examples](#examples)
- [Components](#components)
  - [DataTable](#datatable)
  - [Form System](#form-system)
  - [Button Components](#button-components)
  - [Utilities](#utilities)
- [Development](#development)
- [Contributing](#contributing)

## Installation

```bash
npm install @jasperoosthoek/react-toolbox
```

### Required Peer Dependencies

```bash
npm install react react-dom react-bootstrap bootstrap date-fns date-fns-tz react-dnd react-icons react-localization
```

### Setup

Add Bootstrap CSS to your project:

```typescript
import 'bootstrap/dist/css/bootstrap.min.css';
```

## Quick Start

### Run Examples Locally

```bash
git clone https://github.com/jasperoosthoek/react-toolbox.git
cd react-toolbox
npm install
npm run dev  # Opens interactive examples at localhost:5173
```

### Basic Usage

```typescript
import { FormProvider, FormInput, DataTable } from '@jasperoosthoek/react-toolbox';

const App = () => {
  const formFields = {
    name: { required: true, initialValue: '' },
    email: { required: true, initialValue: '' }
  };

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormProvider formFields={formFields} onSubmit={handleSubmit}>
      <FormInput name="name" label="Full Name" />
      <FormInput name="email" label="Email" type="email" />
      <button type="submit">Submit</button>
    </FormProvider>
  );
};
```

## Examples

The [`src/examples`](https://github.com/jasperoosthoek/react-toolbox/tree/main/src/examples) directory contains comprehensive, working examples demonstrating all components and usage patterns.

### Available Examples

| Category | Example | Description | Source Code |
|----------|---------|-------------|-------------|
| **DataTable** | Basic DataTable | Column sorting and basic functionality | [DataTableExamples.tsx#L20-L50](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/DataTableExamples.tsx#L20-L50) |
| | Paginated DataTable | Search, pagination, and page size controls | [DataTableExamples.tsx#L52-L85](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/DataTableExamples.tsx#L52-L85) |
| | Editable DataTable | Row click to edit with modal forms | [DataTableExamples.tsx#L87-L180](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/DataTableExamples.tsx#L87-L180) |
| | Drag & Drop DataTable | Reorderable rows with drag and drop | [DataTableExamples.tsx#L182-L220](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/DataTableExamples.tsx#L182-L220) |
| | Custom Renderer DataTable | Advanced cell rendering and actions | [DataTableExamples.tsx#L222-L320](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/DataTableExamples.tsx#L222-L320) |
| | Integrated Form DataTable | Full CRUD with FormModalProvider | [DataTableExamples.tsx#L322-L450](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/DataTableExamples.tsx#L322-L450) |
| **Forms** | Custom Form Layout | FormProvider with direct component usage | [FormExamples.tsx#L15-L75](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/FormExamples.tsx#L15-L75) |
| | Modal Forms | FormModalProvider for create/edit modals | [FormExamples.tsx#L88-L125](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/FormExamples.tsx#L88-L125) |
| | Flexible Forms | FormProvider with FormModal integration | [FormExamples.tsx#L128-L165](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/FormExamples.tsx#L128-L165) |
| | Auto-Rendered Forms | FormFieldsRenderer with automatic components | [FormExamples.tsx#L168-L215](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/FormExamples.tsx#L168-L215) |
| | Mixed Form Approach | Direct components with convenience wrappers | [FormExamples.tsx#L235-L295](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/FormExamples.tsx#L235-L295) |
| **IconButtons** | All IconButtons | Complete showcase of available buttons | [IconButtonsExamples.tsx#L15-L120](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/IconButtonsExamples.tsx#L15-L120) |
| | Button Sizes & Variants | Different sizes and Bootstrap variants | [IconButtonsExamples.tsx#L122-L180](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/IconButtonsExamples.tsx#L122-L180) |
| | Custom IconButtons | Creating custom buttons with makeIconButton | [IconButtonsExamples.tsx#L182-L240](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/IconButtonsExamples.tsx#L182-L240) |
| | Buttons with Text | IconButtons with text labels | [IconButtonsExamples.tsx#L242-L290](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/IconButtonsExamples.tsx#L242-L290) |
| | Button Groups | IconButtons in toolbars and groups | [IconButtonsExamples.tsx#L292-L350](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/IconButtonsExamples.tsx#L292-L350) |
| | Upload Text Button | File upload with text reading | [IconButtonsExamples.tsx#L352-L400](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/IconButtonsExamples.tsx#L352-L400) |
| **Confirm Buttons** | ConfirmButton | Modal confirmations for actions | [ButtonComponentsExamples.tsx#L15-L120](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/ButtonComponentsExamples.tsx#L15-L120) |
| | DeleteConfirmButton | Specialized delete confirmations | [ButtonComponentsExamples.tsx#L122-L180](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/ButtonComponentsExamples.tsx#L122-L180) |
| | Advanced Patterns | Complex confirmation scenarios | [ButtonComponentsExamples.tsx#L182-L280](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/ButtonComponentsExamples.tsx#L182-L280) |
| **Localization** | Basic Localization | Using text`localization_string` pattern | [LocalizationExamples.tsx#L20-L120](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/LocalizationExamples.tsx#L20-L120) |
| | Custom Strings | Adding custom localization with functions | [LocalizationExamples.tsx#L122-L200](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/LocalizationExamples.tsx#L122-L200) |
| | Form Localization | Localized forms and validation | [LocalizationExamples.tsx#L202-L250](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/LocalizationExamples.tsx#L202-L250) |
| | DataTable Localization | Localized table components | [LocalizationExamples.tsx#L252-L290](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/LocalizationExamples.tsx#L252-L290) |
| | Language Switcher | Building language switching components | [LocalizationExamples.tsx#L292-L330](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/LocalizationExamples.tsx#L292-L330) |
| | Complete Reference | All available localization strings | [LocalizationExamples.tsx#L332-L400](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/LocalizationExamples.tsx#L332-L400) |

### Development Examples

- **Local Development**: `npm run dev` - Interactive examples with hot reload
- **Build Examples**: `npm run build:examples` - Static build for deployment
- **Test Components**: `npm test` - Complete test suite

## Components

### DataTable

The flagship component - a highly customizable and interactive data table with powerful features for modern applications.

#### Key Features

- **Column Sorting**: Click headers to sort ascending/descending
- **Pagination**: Navigate large datasets smoothly
- **Drag & Drop**: Reorder rows/columns with intuitive drag-and-drop
- **Row Click to Edit**: Open modal forms for quick updates
- **Real-time Search**: Filter data with configurable search
- **Flexible Rendering**: Custom cell renderers and formatters

#### Basic Usage

```typescript
import { DataTable } from '@jasperoosthoek/react-toolbox';

const columns = [
  { name: 'Name', orderBy: 'name' },
  { name: 'Email', orderBy: 'email' },
  { name: 'Actions', className: 'text-center' }
];

<DataTable
  data={users}
  columns={columns}
  onRowClick={(user) => openEditModal(user)}
  searchable
  pagination
  pageSize={10}
/>
```

**[Full DataTable Documentation](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/components/tables/DataTable.tsx)** | **[See Live Demo](https://dashboard-demo-olive-eight.vercel.app/employees)**

### Form System

A comprehensive form architecture with provider pattern, validation, and modal integration.

#### Components

- **FormProvider**: Context provider for form state management
- **FormModal**: Modal forms with built-in submit/cancel actions
- **FormModalProvider**: Simplified provider for create/edit modals
- **Form Fields**: `FormInput`, `FormSelect`, `FormCheckbox`, `FormTextarea`, `FormDropdown`, `FormBadgesSelection`

#### Quick Examples

**Basic Form with Validation**
```typescript
// See complete example: FormExamples.tsx#L15-L75
const formFields = {
  name: { required: true, initialValue: '' },
  email: { required: true, initialValue: '' }
};

const validate = (data) => {
  const errors = {};
  if (data.email && !data.email.includes('@')) {
    errors.email = 'Invalid email format';
  }
  return errors;
};

<FormProvider formFields={formFields} onSubmit={handleSubmit} validate={validate}>
  <FormInput name="name" label="Full Name" />
  <FormInput name="email" label="Email" type="email" />
</FormProvider>
```

**Modal Forms**
```typescript
// See complete example: FormExamples.tsx#L88-L125
<FormModalProvider
  formFields={formFields}
  onCreate={handleCreate}
  onUpdate={handleUpdate}
  createModalTitle="Create New Item"
>
  <FormCreateModalButton>Create New Item</FormCreateModalButton>
</FormModalProvider>
```

**[View All Form Examples](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/FormExamples.tsx)**

### Button Components

Rich collection of icon buttons with loading states and confirmation dialogs.

#### IconButtons

Over 30 pre-built icon buttons using [react-icons](https://react-icons.github.io/react-icons/):

```typescript
import { 
  CheckButton, EditButton, DeleteButton, SaveButton, 
  DownloadButton, UploadButton, CreateButton, CopyButton,
  SearchButton, SortButton, SyncButton, MoveButton,
  // ... and many more
} from '@jasperoosthoek/react-toolbox';

<EditButton onClick={handleEdit} loading={isLoading} />
<DeleteButton onClick={handleDelete} disabled={!canDelete} />
```

#### Custom IconButtons

```typescript
import { makeIconButton } from '@jasperoosthoek/react-toolbox';
import { AiOutlineCheck } from 'react-icons/ai';

const CustomCheckButton = makeIconButton(AiOutlineCheck);

<CustomCheckButton onClick={handleCheck} loading={isLoading} />
```

#### Confirmation Dialogs

```typescript
import { ConfirmButton, DeleteConfirmButton } from '@jasperoosthoek/react-toolbox';

<ConfirmButton
  modalTitle="Are you sure?"
  confirmText="This action cannot be undone"
  onConfirm={handleAction}
  loading={isLoading}
  buttonComponent={EditButton}
/>

<DeleteConfirmButton
  onDelete={handleDelete}
  loading={isDeleting}
/>
```

**[View All Button Components](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/components/buttons/IconButtons.tsx)** | **[See Button Examples](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/IconButtonsExamples.tsx)**

### Localization System

Comprehensive internationalization support with template string syntax and function interpolation.

#### Features

- **Template String Syntax**: Use `text`localization_string`` for clean, readable code
- **Multi-language Support**: Built-in English, French, and Dutch translations
- **Function Interpolation**: Dynamic strings with parameters and pluralization
- **Custom Strings**: Add your own localization strings easily
- **Component Integration**: All components automatically use localized strings

#### Basic Usage

```typescript
import { LocalizationProvider, useLocalization } from '@jasperoosthoek/react-toolbox';

const MyComponent = () => {
  const { text, lang, setLanguage } = useLocalization();

  return (
    <div>
      <h1>{text`save`}</h1>
      <p>{text`are_you_sure`}</p>
      <button onClick={() => setLanguage('fr')}>
        Switch to French
      </button>
    </div>
  );
};

// Wrap your app with LocalizationProvider
<LocalizationProvider lang="en">
  <MyComponent />
</LocalizationProvider>
```

#### Custom Localization Strings

```typescript
const customStrings = {
  en: {
    welcome_message: "Welcome to our app!",
    user_count: (count) => `${count} user${count === 1 ? '' : 's'} online`,
    greeting: (name) => `Hello, ${name}!`,
  },
  fr: {
    welcome_message: "Bienvenue dans notre application!",
    user_count: (count) => `${count} utilisateur${count === 1 ? '' : 's'} en ligne`,
    greeting: (name) => `Bonjour, ${name}!`,
  },
};

const { setLocalization, text } = useLocalization();
setLocalization(customStrings);

// Usage with parameters
<h1>{text`welcome_message`}</h1>
<p>{text`user_count${userCount}`}</p>
<span>{text`greeting${'John'}`}</span>
```

#### Available Default Strings

- **UI Elements**: `save`, `cancel`, `delete`, `search`, `select`, `close`, `ok`
- **Authentication**: `login`, `logout`, `your_email`, `enter_password`, `forgot_password`
- **Form Elements**: `required_field`, `choose_one`, `everything`
- **Table Elements**: `number_of_rows`, `no_information_to_display`, `information_is_being_loaded`
- **Modal Elements**: `modal_create`, `modal_edit`, `are_you_sure`

**[View All Localization Examples](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/LocalizationExamples.tsx)**

### Utilities

#### Custom Hooks

**useLocalStorage** - Persistent state management
```typescript
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

**useError** - Global error handling with ErrorBoundary
```typescript
const { error, clearError } = useError();
```

**useLocalization** - Internationalization support
```typescript
const { getString } = useLocalization();
```

#### Additional Components

- **LoadingIndicator**: Consistent loading states
- **CheckIndicator**: Success/validation indicators  
- **SearchBox**: Integrated search functionality
- **DragAndDropList**: Reorderable lists with react-dnd
- **LoginPage**: Pre-built authentication forms

**[View All Utilities](https://github.com/jasperoosthoek/react-toolbox/tree/main/src/utils)**

## Development

### Project Structure

```
src/
├── components/
│   ├── buttons/        # Icon buttons, confirmations
│   ├── forms/          # Form providers, modals, fields
│   ├── tables/         # DataTable, search, drag & drop
│   ├── indicators/     # Loading, success indicators
│   ├── errors/         # Error boundaries
│   └── login/          # Authentication components
├── utils/              # Hooks, utilities, helpers
├── localization/       # i18n support
└── examples/           # Working examples & demos
    ├── DataTableExamples.tsx      # DataTable demonstrations
    ├── FormExamples.tsx           # Form system examples
    ├── IconButtonsExamples.tsx    # IconButton showcase
    ├── ButtonComponentsExamples.tsx # Confirm button examples
    ├── LocalizationExamples.tsx   # Localization system examples
    └── data/                      # Mock data for examples
```

### Available Scripts

```bash
# Development
npm run dev              # Start examples with hot reload
npm run build:examples   # Build examples for deployment

# Library
npm run build           # Build library for distribution
npm run test            # Run test suite
npm run test:watch      # Watch mode testing
npm run test:coverage   # Coverage report

# Publishing
npm run prepublishOnly  # Test + build before publishing
```

### Testing

Comprehensive test suite with Jest and React Testing Library:

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode for development
npm run test:coverage   # Generate coverage report
```

### TypeScript Support

Full TypeScript support with strict type checking:

- **Library Types**: `dist/index.d.ts`
- **Type Safety**: Strict TypeScript configuration
- **IntelliSense**: Full autocomplete and type hints

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup

```bash
git clone https://github.com/jasperoosthoek/react-toolbox.git
cd react-toolbox
npm install
npm run dev  # Start development server
```

### Guidelines

1. **Add Examples**: New components should include working examples
2. **Write Tests**: Maintain test coverage for all components
3. **Update Documentation**: Keep README and examples in sync
4. **Follow TypeScript**: Use strict typing for all components
5. **Test Locally**: Run examples and tests before submitting

### Reporting Issues

Found a bug? Have a feature request? Please create an issue on [GitHub](https://github.com/jasperoosthoek/react-toolbox/issues).

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- **[Dashboard Demo](https://dashboard-demo-olive-eight.vercel.app/employees)** - Live demonstration
- **[Dashboard Source](https://github.com/jasperoosthoek/dashboard-demo)** - Complete application example
- **[GitHub Repository](https://github.com/jasperoosthoek/react-toolbox)** - Source code and issues
- **[NPM Package](https://www.npmjs.com/package/@jasperoosthoek/react-toolbox)** - Installation and versions

---

**Built with React, TypeScript, and react-bootstrap**
