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

**Online:** Visit [react-toolbox.vercel.app](https://react-toolbox.vercel.app) for interactive examples with copy-pasteable code (server-side rendered)

**Locally:**
```bash
git clone https://github.com/jasperoosthoek/react-toolbox.git
cd react-toolbox
npm install
npm run dev  # Interactive examples at localhost:5173
```

## Documentation & Examples

### Live Interactive Examples
- **[Interactive Examples](https://react-toolbox.vercel.app)** - Live component playground with copy-pasteable code (SSR-enabled)
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

- **Values** go to a function message: `` text`greeting${name}` `` with ``greeting: (name) => `Hello ${name}` ``.
- **Keys built at runtime**: the tag only sees the part before the first value (`` text`status_${s}` `` looks up
  `status_`), so use `` text.byKey(`status_${s}`) ``. `text.hasKey(key)` tells whether a key exists, e.g. to show a
  backend error message as it is when there is no translation for it.
- **Fallback**: a key that is missing (or `""`) in the current language comes from the default language, the first of
  the provider's `languages` (`en` by default).
- **Keys are dot paths**: `"a.b"` looks up `a` and then `b`, so a flat key containing a literal dot can't be found.
- The `lang` and `localization` props can change at any time. Pass a hoisted or memoized `localization` object if
  `text` should keep its identity (e.g. as an effect dependency); an inline object literal gives a new `text` on every
  render.

#### Localization on the server

`@jasperoosthoek/react-toolbox/localization` has the same lookup without React, so it works in React Server
Components, route handlers and plain Node (the main entry creates React contexts when it loads, which Server
Components don't allow). It exports `createText`, `combineLocalization`, `defaultLocalization`, `defaultLanguages` and
the types (ESM only).

```typescript
import { createText } from '@jasperoosthoek/react-toolbox/localization';

const text = createText(localization, lang);   // optional third argument: the default language
text`save`;
text.byKey(`status_${status}`);
text.hasKey('status_open');
```

`createText` returns a snapshot for one language: it never changes and holds no shared state, so concurrent requests
in different languages can't affect each other. Pass the language as an argument (also to cached functions, so it is
part of the cache key). Texts rendered on the server follow the language only through a new server render (e.g. the
language in the URL), not through `setLanguage` in the browser; the provider and `useLocalization` stay the way to
switch languages on the client.

> **See comprehensive examples**: Visit the [interactive examples](https://react-toolbox.vercel.app) or run `npm run dev` locally

## Development

### Available Scripts

```bash
npm run dev              # Start interactive examples locally (with SSR)
npm run build           # Build library for npm distribution
npm run test            # Run tests
npm run build:examples  # Build examples for deployment (react-toolbox.vercel.app)
npm run test:package    # Build, pack and test the package as a consumer loads it (before publishing)
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
- **SSR Compatible**: Server-side rendering ready with 4x performance improvement
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
