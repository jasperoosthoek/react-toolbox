import {
  FormFields,
  FormFieldConfig,
  FormProviderProps,
  InitialState,
  OnSubmit,
  useForm,
} from '../src/components/forms/FormProvider';
import { FormValue } from '../src/components/forms/FormFields';

// ── Sample typed field config — narrow T inferred via `satisfies` ──
const fields = {
  name: { initialValue: '' },
  age: { initialValue: 0 },
} satisfies FormFields;

type Fields = typeof fields;

// ── OnSubmit<T> — state is { [k in keyof T]: FormValue } ──────────
const onSubmit: OnSubmit<Fields> = (state, callback) => {
  const _name: FormValue = state.name;
  const _age: FormValue = state.age;
  if (callback) callback();
  // @ts-expect-error — unknown key
  state.unknown;
  void _name;
  void _age;
};
void onSubmit;

// ── InitialState<T> ────────────────────────────────────────────────
const initialOk: InitialState<Fields> = { name: 'a' };
const initialEmpty: InitialState<Fields> = {};
void initialOk;
void initialEmpty;

// @ts-expect-error — unknown key in InitialState
const initialBad: InitialState<Fields> = { unknown: 'x' };
void initialBad;

// ── FormProviderProps<T> ───────────────────────────────────────────
const props: FormProviderProps<Fields> = {
  formFields: fields,
  onSubmit,
  children: null,
};
void props;

// @ts-expect-error — onSubmit is required
const missingOnSubmit: FormProviderProps<Fields> = {
  formFields: fields,
  children: null,
};
void missingOnSubmit;

// ── useForm<T>() returns FormContextType<T> ────────────────────────
const ctx = useForm<Fields>();
const _formData: { name: FormValue; age: FormValue } | null = ctx.formData;
const _initialFormData: { name: FormValue; age: FormValue } | null = ctx.initialFormData;
void _formData;
void _initialFormData;

ctx.setFormData({ name: 'x' });
ctx.setFormData({ age: 5 });
ctx.setFormData({});

// @ts-expect-error — unknown key in setFormData
ctx.setFormData({ unknown: 'x' });

// useForm<T>() casts FormContext to FormContextType<T> internally, so a
// wrong T parameter compiles without error. This documents the limitation.
const looseCtx = useForm<{ unrelated: FormFieldConfig }>();
const _loose: { unrelated: FormValue } | null = looseCtx.formData;
void _loose;
