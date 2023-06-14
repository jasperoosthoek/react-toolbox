/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FormInput, FormCheckbox, FormSelect, FormDropdown, FormBadgesSelection } from './FormFields';

afterEach(() => {
  jest.clearAllMocks();
});

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

test('FormSelect component handles input correctly', () => {
  const mockOnChange = jest.fn();
  const list = [
    {
      id: '1',
      name: 'item1',
      children: 'Item 1',
    }, 
    {
      id: '2',
      name: 'item2',
      children: 'Item 2',
    },
  ];
  const { getByText, getByRole } = render(
    <FormSelect
      {...mockFields}
      list={list}
      label={<>test</>}
      onChange={mockOnChange}
    />
  );
  const select = getByRole('listbox') as HTMLSelectElement;

  fireEvent.change(select, { target: { value: '2' } });
  
  // Asserting the onChange callback was not called by the onChange event of the select
  expect(mockOnChange).not.toBeCalled();
  const option = getByText('Item 2') as HTMLOptionElement;
  
  // Asserting the onChange callback is called by the onClick event of the option
  fireEvent.click(option);//, { target: { value: '2' } });
  expect(mockOnChange).toBeCalledWith('2');
});

// test('FormDropdown component handles input correctly', () => {
//   const mockOnChange = jest.fn();
//   const list = [{ id: '1', name: 'item1' }, { id: '2', name: 'item2' }];
//   const { getByText } = render(<FormDropdown list={list} onChange={mockOnChange} />);
//   const item = getByText('item1') as HTMLSelectElement;

//   fireEvent.click(item);
//   expect(mockOnChange).toBeCalledWith('1');
// });

// test('FormBadgesSelection component handles input correctly', () => {
//   const mockOnChange = jest.fn();
//   const list = [{ id: '1', name: 'item1' }, { id: '2', name: 'item2' }];
//   const { getByText } = render(<FormBadgesSelection list={list} onChange={mockOnChange} />);
//   const item = getByText('item1') as HTMLSelectElement;

//   fireEvent.click(item);
//   expect(mockOnChange).toBeCalledWith('1');
// });