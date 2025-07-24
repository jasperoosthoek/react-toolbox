# React Toolbox

A comprehensive library of React components that integrates seamlessly with [react-bootstrap](https://react-bootstrap.github.io/). Build modern, interactive applications faster with pre-built, customizable components.

## Quick Start

**[Live Dashboard Demo](https://dashboard-demo-olive-eight.vercel.app/employees)** | **[Interactive Examples](https://react-toolbox.vercel.app)** | **[Dashboard Source Code](https://github.com/jasperoosthoek/dashboard-demo)**

### Installation

```bash
npm install @jasperoosthoek/react-toolbox
```

**Required peer dependencies:**
```bash
npm install react react-dom react-bootstrap bootstrap date-fns date-fns-tz react-dnd react-icons react-localization
```

**Setup:**
```typescript
import 'bootstrap/dist/css/bootstrap.min.css';
```

### Try It Now

**Online:** Visit [react-toolbox.vercel.app](https://react-toolbox.vercel.app) for interactive examples with copy-pasteable code

**Locally:**
```bash
git clone https://github.com/jasperoosthoek/react-toolbox.git
cd react-toolbox
npm install
npm run dev  # Interactive examples at localhost:5173
```

## Documentation & Examples

### Live Interactive Examples
- **[Interactive Examples](https://react-toolbox.vercel.app)** - Live component playground with copy-pasteable code
- **[Live Dashboard Demo](https://dashboard-demo-olive-eight.vercel.app/employees)** - Complete real-world application
- **[Local Development](##)** - Run `npm run dev` for local examples with hot reload

### Example Categories
The live examples include comprehensive demonstrations with working code you can copy and paste:

- **[DataTable Examples](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/components/DataTableExamples.tsx)** - Tables, pagination, editing, drag & drop
- **[Form Examples](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/components/FormExamples.tsx)** - Forms, validation, modals
- **[Button Examples](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/components/IconButtonsExamples.tsx)** - Icon buttons, confirmations
- **[Localization Examples](https://github.com/jasperoosthoek/react-toolbox/blob/main/src/examples/components/LocalizationExamples.tsx)** - Multi-language support

## Core Components

### DataTable
Feature-rich data tables with sorting, pagination, search, drag & drop, and inline editing.

```typescript
import { DataTable } from '@jasperoosthoek/react-toolbox';

<DataTable
  data={users}
  columns={columns}
  onClickRow={openEditModal}
/>
```

### Form System
Comprehensive form management with validation, modals, and field components.

```typescript
import { FormProvider, FormInput } from '@jasperoosthoek/react-toolbox';

<FormProvider formFields={formFields} onSubmit={handleSubmit}>
  <FormInput name="email" label="Email" type="email" />
</FormProvider>
```

### Icon Buttons
30+ pre-built buttons with loading states and confirmation dialogs.

```typescript
import { EditButton, DeleteConfirmButton } from '@jasperoosthoek/react-toolbox';

<EditButton onClick={handleEdit} loading={isLoading} />
<DeleteConfirmButton onDelete={handleDelete} />
```

### Localization
Template string syntax with multi-language support.

```typescript
import { LocalizationProvider, useLocalization } from '@jasperoosthoek/react-toolbox';

const { text } = useLocalization();
return <h1>{text`save`}</h1>;
```

> **See comprehensive examples**: Visit the [interactive examples](https://react-toolbox.vercel.app) or run `npm run dev` locally

## Development

### Available Scripts

```bash
npm run dev              # Start interactive examples locally
npm run build           # Build library for npm distribution
npm run test            # Run tests
npm run build:examples  # Build examples for deployment (react-toolbox.vercel.app)
```

### Project Structure

```
src/
├── components/         # Library components
│   ├── buttons/       # Icon buttons, confirmations
│   ├── forms/         # Form system
│   ├── tables/        # DataTable components
│   └── ...
├── examples/          # Interactive examples (deployed to react-toolbox.vercel.app)
└── utils/             # Hooks and utilities
```

### Testing & TypeScript

- **Full TypeScript support** with strict type checking
- **Comprehensive test suite** with Jest and React Testing Library
- **Type definitions** included in distribution

## Contributing

### Quick Setup
```bash
git clone https://github.com/jasperoosthoek/react-toolbox.git
cd react-toolbox
npm install
npm run dev
```

### Guidelines
- Add working examples for new components
- Maintain test coverage
- Follow TypeScript best practices
- Update documentation as needed

## Package Information

- **TypeScript**: Full type definitions included
- **Tree Shaking**: ES modules supported
- **Bundle Size**: Optimized for production
- **Peer Dependencies**: Uses your existing React/Bootstrap setup

## Links

- **[NPM Package](https://www.npmjs.com/package/@jasperoosthoek/react-toolbox)**
- **[GitHub Repository](https://github.com/jasperoosthoek/react-toolbox)**
- **[Interactive Examples](https://react-toolbox.vercel.app)**
- **[Live Dashboard Demo](https://dashboard-demo-olive-eight.vercel.app/employees)**
- **[Dashboard Demo Source](https://github.com/jasperoosthoek/dashboard-demo)**

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with React, TypeScript, and react-bootstrap**
