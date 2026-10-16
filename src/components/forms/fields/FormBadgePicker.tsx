import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { DisabledProps } from '../FormFields';
import { useLocalization } from '../../../localization/LocalizationContext';
import { useFormField } from '../FormField';
import { FormError } from './FormError';
import { BadgeSelection } from './FormBadgesSelection';
import { IsRequiredAsterisk } from './FormInput';

export interface FormBadgePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'onChange' | 'disabled' | 'list'
> {
  name: string;
  label?: React.ReactElement | string;
  list: any[];
  idKey?: string;
  multiple?: boolean;
  integer?: boolean;
  disabled?: boolean | ((props: DisabledProps) => boolean);
  toggleText?: React.ReactElement | string;
  emptyText?: React.ReactElement | string;
}

const normalizeValue = (
  value: string | number | (string | number)[] | null,
  multiple: boolean,
  integer?: boolean
): Array<string | number> => {
  const parseValue = (val: string | number) => integer ? parseInt(`${val}`, 10) : `${val}`;

  if (Array.isArray(value)) {
    return value.map(parseValue);
  }

  if (value === null || value === undefined || value === '') {
    return [];
  }

  const normalized = [parseValue(value)];
  return multiple ? normalized : normalized.slice(0, 1);
};

type SelectLikeToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isInvalid?: boolean;
  placeholder?: boolean;
};

const SelectLikeToggle = React.forwardRef<HTMLButtonElement, SelectLikeToggleProps>(
  ({ className, isInvalid, placeholder, children, ...toggleProps }, ref) => {
    const forwardedClasses = `${className || ''}`
      .split(' ')
      .filter((cssClass) => cssClass && cssClass !== 'dropdown-toggle')
      .join(' ');

    return (
      <button
        type="button"
        ref={ref}
        className={[
          'form-select',
          'text-start',
          placeholder ? 'text-muted' : '',
          isInvalid ? 'is-invalid' : '',
          forwardedClasses,
        ].filter(Boolean).join(' ')}
        {...toggleProps}
      >
        {children}
      </button>
    );
  }
);

SelectLikeToggle.displayName = 'SelectLikeToggle';

export const FormBadgePicker = (props: FormBadgePickerProps) => {
  const {
    list,
    idKey = 'value',
    multiple,
    integer,
    disabled,
    toggleText,
    emptyText,
    className,
    ...componentProps
  } = props;

  const { strings } = useLocalization();
  const { value, onChange, isInvalid, error, label, required, mergedProps, formId } = useFormField(componentProps);

  const isMultiple = multiple !== undefined ? multiple : Array.isArray(value);
  const pickerValue = value as string | number | (string | number)[] | null;
  const items = Array.isArray(list) ? list : [];
  const selectedValues = normalizeValue(pickerValue, isMultiple, integer);
  const parseValue = (val: string | number) => integer ? parseInt(`${val}`, 10) : `${val}`;
  const controlId = `${formId}-${props.name}`;

  if (!list) {
    console.error('Missing required list property in FormBadgePicker');
  }

  const isSelected = (item: any) => selectedValues.includes(parseValue(item[idKey]));
  const selectedItems = items.filter((item: any) => isSelected(item));
  const placeholderText = emptyText ?? strings.getString('choose_one');

  const isItemDisabled = (item: any) => (
    typeof disabled === 'function'
      ? disabled({ list: items, value: item[idKey], state: {}, initialState: {}, initialValue: '' })
      : !!disabled || !!item.disabled
  );

  const addValue = (item: any) => {
    const normalized = parseValue(item[idKey]);
    if (isMultiple) {
      onChange([...selectedValues, normalized]);
      return;
    }
    onChange(normalized);
  };

  const removeValue = (item: any) => {
    const normalized = parseValue(item[idKey]);
    if (isMultiple) {
      onChange(selectedValues.filter((selected) => selected !== normalized));
      return;
    }
    onChange('');
  };

  const toggleValue = (item: any) => {
    if (isSelected(item)) {
      removeValue(item);
      return;
    }

    addValue(item);
  };

  const toggleLabel = toggleText ?? (
    selectedItems.length > 0
      ? strings.getString('select')
      : placeholderText
  );

  return (
    <Form.Group controlId={controlId} className={className}>
      {label && <Form.Label>{label}{required && <IsRequiredAsterisk />}</Form.Label>}
      {isInvalid && <FormError error={error} />}
      {items.length > 0 && (
        <Dropdown className="w-100" data-testid={`${props.name}-dropdown`}>
          <Dropdown.Toggle
            as={SelectLikeToggle}
            disabled={disabled === true}
            isInvalid={isInvalid}
            placeholder={selectedItems.length === 0 && !toggleText}
            data-testid={`${props.name}-toggle`}
          >
            {toggleLabel}
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            {items.map((item: any, index) => {
              const itemDisabled = isItemDisabled(item);
              const selected = isSelected(item);
              return (
                <Dropdown.Item
                  as="button"
                  key={`${item[idKey]}-${index}`}
                  disabled={itemDisabled}
                  data-testid={`${props.name}-option-${item[idKey]}`}
                  onClick={() => {
                    if (itemDisabled) return;
                    toggleValue(item);
                  }}
                >
                  <span
                    data-testid={`${props.name}-option-block-${item[idKey]}`}
                    className={[
                      'd-inline-flex',
                      'w-100',
                      'align-items-center',
                      'gap-2',
                      'px-2',
                      'py-1',
                      'rounded',
                      selected ? 'bg-secondary text-white' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      readOnly
                      tabIndex={-1}
                      disabled={itemDisabled}
                      data-testid={`${props.name}-option-checkbox-${item[idKey]}`}
                    />
                    <span>{item.label ?? `${item[idKey]}`}</span>
                  </span>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      )}
      {selectedItems.length > 0 && (
        <div className="mt-2 d-flex flex-wrap gap-1 align-items-center" data-testid={`${props.name}-selected-values`}>
          {selectedItems.map((item: any, index) => (
            <BadgeSelection
              key={`${item[idKey]}-${index}`}
              disabled={isItemDisabled(item)}
              selected={true}
              cursor={isItemDisabled(item) ? 'default' : 'pointer'}
              onClick={() => removeValue(item)}
              {...mergedProps}
            >
              {item.label ?? `${item[idKey]}`}
            </BadgeSelection>
          ))}
        </div>
      )}
    </Form.Group>
  );
};
