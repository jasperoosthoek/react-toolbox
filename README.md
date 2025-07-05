# React Toolbox

A library of useful [React](https://react.dev/) components for building user interfaces. A [Dashboard Demo](https://github.com/jasperoosthoek/dashboard-demo) repository and [live demo](https://dashboard-demo-olive-eight.vercel.app/employees) is available that showcases what this module is capable of including many code examples.

### The DataTable component
This is a highly customizable and interactive DataTable component. It provides a seamless user experience with powerful features, making it ideal for displaying and managing data efficiently while keeping development time to a minimum.

#### Key features

- **Column Sorting**: Click column headers to sort data in ascending or descending order.
- **Pagination**: Navigate through large datasets smoothly with built-in pagination.
- **Drag & Drop**: Easily reorder rows or columns via intuitive drag-and-drop functionality based on [`react-dnd`](https://react-dnd.github.io/react-dnd/about).
- **Row Click to Edit**: Open a modal with an edit form when clicking a row for quick updates.
- **Search & Filter**: Instantly find relevant data with a easy to configure real-time search input.
</ul>

### The ErrorBoundary component

Simple `ErrorBoundary` component with `useError` hook that can be used to get and clear the error anywhere in the application:

```typescript
export const App = () => (
  <ErrorBoundary>
    <BrowserRouter />
    // Rest of the app
  </ErrorBoundary>
);


// React component somewhere in the tree
const MyComponent = () => {
  const { error, clearError } = useError();
  if (error) console.error(error);

  return (
    <div
      className='display-error'
      onClick={() => clearError()}
    > 
      {error && 'An error occurred, click to clear'}
    <div>
  )
}

```

### Custom hooks

#### useLocalStorage

Provides a state and setter function similar to `useState` of which the value is kept in `localStorage`. 

```typescript
const MyComponent = () => {
  const [lang, setLang] = useLocalStorage<'en', 'fr', 'nl'>('lang-key', 'en');
  ...
```

### IconButtons
Button component that takes an icon from [`react-icons`](https://react-icons.github.io/react-icons/) and has [`Button`](https://react-bootstrap.github.io/docs/components/buttons) properties of React Bootstrap. The `loading` replaces the icon by a spinner identical in size.

```typescript
import { AiOutlineCheck, DownloadButton } from 'react-icons/ai';
import { makeIconButton } from '@jasperoosthoek/react-toolbox';

const CheckButton = () => (
  <IconButton
    size='lg'
    icon={AiOutlineCheck} 
    loading={isLoading}
  />
)
// Or Simply use makeIconButton to creare a button component
const DownloadButton = makeIconButton(AiOutlineDownload);
```

A number of IconButton have been selected from `react-icons` by the author:

```typescript
import {
  CheckButton, CopyButton, PasteButton, CloseButton, CogButton, CreateButton, 
  CreateFolderButton, CreateSubFolderButton, CreateFileButton, DeleteButton, DownButton,
  DownloadButton, EditButton, FlagButton, HideButton, LinkButton, ListButton, MenuButton,
  MoveButton, NotesButton, PencilButton, PlayButton, SaveButton, SearchButton, ShowButton, 
  SortButton, SortUpButton, SortDownButton, StopButton, SyncButton, UnCheckButton, 
  UnlockButton, UpButton, UploadButton, QuestionnaireButton, DropdownButton, ResetButton 
} from '@jasperoosthoek/react-toolbox';

```

### Confirm button

The `ConfirmButton` provides a confirmation modal (popup) to a button component defined before. You can provide it a custom:

- `modalTitle`: Title of the modal
- `modalBody`: Body of the modal or empty
- `confirmText`: Something like "Are you sure?"
- `cancelText`: The "Cancel" text to show on the cancel button.

The `ConfirmButton` can be used go conveniently go through asynchronous state such as an api operation. Note that the cancel button just closes the modal and nothing happens.

- `onConfirm`: What to do when the user presses the "Ok" button, performed inside the component
- `loading`: A spinner appears next to the "Ok" button and the "Ok" button is disabled.
- `closeUsingCallback`: (Optional) The `onConfirm` function has finished, `closeUsingCallback` is called if it is a function and the modal is closed.
- `buttonComponent`: The button component such as `DownloadButton` created above with `makeIconButton`.

```typescript
import { MoveButton } from '@jasperoosthoek/react-toolbox';

const SomeComponent = () => {
  const loading = useMoveLoadingState();
  const handleMove = () => {
    ...
  }

  return (
    <div>
      ...

      <ConfirmModal
        modalTitle='Do you want to move the object?'
        loading={loading}
        onConfirm={handleMove}
        buttonComponent={MoveButton}
      />
    </div>
  )
}

### The DeleteConfirmButton

Very similar to the ConfirmButton but specialize to deleting something. Note that `buttonComponent` is the `DeleteButton`.

import { MoveButton } from '@jasperoosthoek/react-toolbox';

const SomeComponent = () => {
  const loading = useDeleteLoadingState();
  const handleDelete = () => {
    ...
  }

  return (
    <div>
      ...

      <DeleteConfirmButton
        loading={loading}
        onDelete={handleMove}
      />
    </div>
  )
}
