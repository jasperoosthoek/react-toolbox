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