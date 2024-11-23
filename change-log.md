##### Version 0.2.1
- Fix not updating state correctly in `CreateEditModal` component .
- Install packages for development

##### Version 0.2.2
- New `style` prop for `DataTable` component
- Fix `FormInput` has `type="input"`
- `FormSelect` correctly handles "no data" by selecting hidden option
- Refactor `IconButtons` & be able to pass `children` prop
- Language strings for `DeleteConfirmButton`

##### Version 0.2.3
- New `dialogClassName` prop in `CreateEditModal` component

##### Version 0.2.4
- New `useSetState` hook that mimics the `setState` behavior of class based components
- New `useWithDispatch` hook that turns a redux action or object with redux actions to dispatchable hooks

##### Version 0.2.5
- Optional `width` prop in `CreateEditModal` component
- Improved `FormCheckbox` and `FormSelectControl` component
- `LoadingIndicator` component uses jumbotron component from Bootstrap 4
- New `loginFactory` that creates `Login` component & redux actions and reducer

##### Version 0.2.6
- New `useLocalization` hook
- New `required` property in `CreateEditModal` component
- Make initial state of `auth.user` `null` instead of `{}`

##### Version 0.2.7
- New `FormDate` and `FormDateTime` component
##### Version 0.2.8
- New `setState` prop given to custom component in `CreateEditModal` component

##### Version 0.2.9
- New `icon-button` html class added to `IconButton` component

##### Version 0.2.10
- Remove `lodash` dependency as it was only used once
- New `FormBadgesSelection` component as an alternative to `FormSelect`
- Merge `initialState` with automatically produced state in `CreateEditModal`

##### Version 0.2.11
- New `initialState` and `initialValue` props given to form component in `CreateEditModal` and to `disabled` function in `FormSelect` and `FormBadgesSelection` components

##### Version 0.2.12
- Fix giving unrecognised `restProps` to form components

##### Version 0.2.13
- New `buttonSize` prop in Icon buttons to set the size of the `Button` component
- New `QuestionnaireButton` and `CheckIndicator` component

##### Version 0.2.14
- New `UnCheckButton` component with same icon as `CheckIndicator`

##### Version 0.2.15
- Fix missing `React` import in `CheckIndicator` component

##### Version 0.2.16
- Make 'Are u sure?' default text in `ConfirmButton` component

##### Version 0.2.17
- New `BigSpinner` component
- Fix `UploadTextButton` not working

##### Version 0.2.18
- New `FormDropdown` component
- Fix `CreateEditModal` component crashes when using `show` prop to toggle modal

##### Version 0.2.19
- New `useInterval` hook

##### Version 0.2.20
- New `SearchBox` and `SearchIcon` components
- Fix not resetting state in `CreateEditModal` when toggle `show` prop

##### Version 0.2.21
- Move localization strings to `src/localizations/strings.js`
- Fix making additional localization strings work
- Convert back and forth to `utc` in `FormDateTime` component

##### Version 0.2.22
- New `ShowButton` and `HideButton` components

##### Version 0.2.23
- Await result of `onConfirm()` in `ConfirmButton`

##### Version 0.2.24
- New `rowClassName` prop and add missing localization strings to `DataTable`

##### Version 0.3.0
- Minimal typescript configuration

##### Version 0.3.1
- Add `*.d.ts` files during build

##### Version 0.3.2
- Fix missing `types` in `package.json`

##### Version 0.3.3
- Fix default `rowsPerPage` option in `DataTable`

##### Version 0.3.4
- Simplify `IconButtons` & new `makeIconButton` function
- New `text` tag function to make using localization strings more concise
- Additional localization supports function and takes arguments from `text` tag function
- New `setLanguage` function and `languages` override to set available languages
- `useSetState` hook supports `callback` in setter function similar to `setState` in `class` components
- New optional `callback` function argument to `getCurrentUser`
- New French translation
- New `storeState` & `retrieveState` functions to store and retrieve state object from `localStorage`
- Convert everything to Typescript
- `CreateEditModal` component uses `onKeyPress` instead of deprecated `onKeyPress` handler

##### Version 0.3.5
- New `SaveButton` component
- New `setLocalization` function supplied by `useLocalization` to reset localization
- Fix bug in `text` function parameter types supplied by `useLocalization`

##### Version 0.3.6
- New `ErrorBoundary` provider that can supply custom error events

##### Version 0.3.7
- Improve out of context error in `ErrorBoundary` and remove debug console.log 

##### Version 0.4.0
- Upgrade to `react@18.2.0`
- Install `jest` and related packages for testing
- Write tests for `FormFields` components

##### Version 0.4.1
- Upgrade dependencies

##### Version 0.4.2
- Fix incorrect props types in `DataTable` component

##### Version 0.4.3
- Fix incorrect `onMove` type of `DataTable` component prop

##### Version 0.4.4
- Improve types of `DataTableProps`

##### Version 0.4.5
- Fix pagination not working correctly in `DataTable` component
- Improve types of `CreateEditModalProps`

##### Version 0.4.6
- Allow `modalTitle` prop in `CreateEditModal` component to be `ReactElement` and string
- Allow props in `ConfirmButton` and `DeleteConfirmButton` component to be `ReactElement` and string
- Fix: loading spinner visible in modal of `DeleteConfirmButton`

##### Version 0.4.7
- Fix: Incorrect return type of `OnClickRow` type

##### Version 0.4.8
- Improvements of `CreateEditModal` types

##### Version 0.4.9
- Fix: Allow `component` prop of `SmallSpinner` to be string
- Fix: Allow `axios` prop of `loginFactory` to be of type `AxiosInstance`
- Fix: Not including languages from `additionalLocalization` in `LocalizationProvider`
- Hook `useWithDispatch` only takes function as an argument to fix broken return type
- Fix: `useLogin` output has types 

##### Version 0.4.10
- Add type to input argument of `onChange` and `onKeyPress` functions
- Login when press enter key on email and password field on `Login` component

##### Version 0.4.11
- Make `onLogout` parameter optional in loginFactory
- Add `axios` as a dependency

##### Version 0.4.12
- Add missing localization for enter_email

##### Version 0.4.13
- Prevent login when either email address of password field is empty
- New optional `label` prop `Login` component

##### Version 0.4.14
- Replace deprecated `onKeyPress` props with `onKeyDown`
- Allow column name of `DataTable` to be `ReactNode`

##### Version 0.4.15
- New `CreateEditModalProvider` component

##### Version 0.4.16
- Selectively show components in header of `DataTable` component

##### Version 0.4.17
- Allow `textOnEmpty` of `DataTable` to be string
- New `cancelText` prop and make `confirmText` prop optional in `ConfirmButton` component
- Move `ConfirmButton` and `DeleteConfirmButton` to separate files

##### Version 0.4.18
- New `useLocalStorage` hook that functions like `useState`
- The `DataTable` `selector` function can output `string` and `number` as well

##### Version 0.4.19
- Improve `useLocalStorage` hook so it updates other components using it

##### Version 0.4.20
- New `PasteButton` component

##### Version 0.4.21
- Make `decimal` argument of `round` and `roundFixed` optional

##### Version 0.4.22
- Add `onClick` to column of `DataTable`

##### Version 0.4.23
- New `optionsDropdown` parameter and Dropdown menu in  column of `DataTable`

##### Version 0.4.24
- Allow `validate` function in `CreateEditModal` to allow objects with empty values

##### Version 0.4.25
- Usable `onClick` handler in  `ShowCreateModalButton` and `ShowEditModalButton`

##### Version 0.4.26
- Prop `orderByColumn` of `DataTable` can be a function that yields a number

##### Version 0.5.0
- Upgrade to `React` 18.3.1

##### Version 0.5.1
- Upgrade `react-redux` & `redux-thunk` to versions compatible with `redux` 5.0.1
- Update `Login` component to use `LoginActions` type.
