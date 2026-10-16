import { FormComponentProps } from '../src/components/forms/FormFields';

// ── Positive: documented props are accessible and correctly typed ──
const ValidCustomComponent = ({ name, label, placeholder, required }: FormComponentProps) => {
  const _name: string = name;
  const _label: typeof label = label;
  const _placeholder: string | undefined = placeholder;
  const _required: boolean | undefined = required;
  void _name;
  void _label;
  void _placeholder;
  void _required;
  return null;
};
void ValidCustomComponent;

// ── Negative: fields removed from 0.11+ FormComponentProps are not present ──
// The renderer at FormModal.tsx:108 spreads only {name, label, placeholder,
// required, ...formProps}. The probe locks the type to match.
const LegacyCustomComponent = (props: FormComponentProps) => {
  // @ts-expect-error — `value` was in 0.8.x FormComponentProps; renderer never passes it. Use useFormField.
  void props.value;
  // @ts-expect-error — `onChange` removed; use useFormField.
  void props.onChange;
  // @ts-expect-error — `state` not passed; use useForm().
  void props.state;
  // @ts-expect-error — `setState` not passed; use useForm().
  void props.setState;
  // @ts-expect-error — `initialState` not passed.
  void props.initialState;
  // @ts-expect-error — `initialValue` not passed.
  void props.initialValue;
  // @ts-expect-error — `submitAttempted` not passed; use useForm().
  void props.submitAttempted;
  // @ts-expect-error — `isInvalid` not passed; use useFormField for validation.
  void props.isInvalid;
  // @ts-expect-error — `modified` not passed; use useForm().
  void props.modified;
  // @ts-expect-error — `keyName` not passed.
  void props.keyName;
  return null;
};
void LegacyCustomComponent;
