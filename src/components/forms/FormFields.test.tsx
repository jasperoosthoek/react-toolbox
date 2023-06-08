/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FormInput, FormCheckbox, FormSelect, FormDropdown, FormBadgesSelection } from './FormFields';

// export type FormType = {
//   state: any;
//   setState: (obj: any) => void;
//   initialState: any;
//   initialValue: any;
//   keyName: string;
//   pristine: boolean;
// }
// Test for FormInput
const mockFields = {
  initialState: {},
  initialValue: 'myval',
  state: {},
  setState: (obj: any) => {},
  keyName: 'test123',
  pristine: true,
}
test('FormInput component handles input correctly', () => {
  const mockOnChange = jest.fn();
  const { getByLabelText } = render(
    <FormInput
      {...mockFields}
      label={<>test</>}
      onChange={mockOnChange}
    />
  );
  const input = getByLabelText('test') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'new value' } });
  expect(mockOnChange).toBeCalledWith('new value');
});

// Test for FormCheckbox
test('FormCheckbox component handles input correctly', () => {
  const mockOnChange = jest.fn();
  const { getByRole } = render(
  <FormCheckbox
    {...mockFields}
    label={<>test</>}
    onChange={mockOnChange}
  />
  );
  const checkbox = getByRole('checkbox') as HTMLInputElement;

  fireEvent.click(checkbox);
  expect(mockOnChange).toBeCalledWith(true);
});
