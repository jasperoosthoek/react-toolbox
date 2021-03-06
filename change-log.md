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
