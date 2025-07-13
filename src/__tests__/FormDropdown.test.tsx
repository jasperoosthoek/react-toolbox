import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { FormDropdown } from '../components/forms/fields/FormDropdown';
import { FormProvider } from '../components/forms/FormProvider';

describe('FormDropdown', () => {
  const mockFormFields = {
    category: {
      label: 'Category',
      required: true,
      formProps: { 'data-testid': 'dropdown-select' },
    },
    status: {
      label: 'Status',
      required: false,
      formProps: {},
    },
  };

  const mockFormValues = {
    category: 'electronics',
    status: '',
  };

  const defaultOptions = [
    { value: '', label: 'Select a category' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
  ];

  const renderWithFormProvider = (
    ui: React.ReactElement, 
    formValues = mockFormValues,
    additionalProps = {}
  ) => {
    return render(
      <FormProvider 
        formFields={mockFormFields}
        initialState={formValues}
        onSubmit={jest.fn()}
        {...additionalProps}
      >
        {ui}
      </FormProvider>
    );
  };

  describe('Basic Functionality', () => {
    it('should render dropdown with label', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormDropdown name="category" options={defaultOptions} />
      );

      const select = getByLabelText('Category *');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });

    it('should render all options', () => {
      const { getByRole } = renderWithFormProvider(
        <FormDropdown name="category" options={defaultOptions} />
      );

      const select = getByRole('combobox');
      const options = select.querySelectorAll('option');
      
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent('Select a category');
      expect(options[1]).toHaveTextContent('Electronics');
      expect(options[2]).toHaveTextContent('Clothing');
      expect(options[3]).toHaveTextContent('Books');
    });

    it('should show selected value', () => {
      const { getByDisplayValue } = renderWithFormProvider(
        <FormDropdown name="category" options={defaultOptions} />
      );

      expect(getByDisplayValue('Electronics')).toBeInTheDocument();
    });

    it('should handle change events', () => {
      const { getByRole } = renderWithFormProvider(
        <FormDropdown name="category" options={defaultOptions} />
      );

      const select = getByRole('combobox');
      fireEvent.change(select, { target: { value: 'clothing' } });

      expect(select).toHaveValue('clothing');
    });

    it('should show validation error when invalid', () => {
      const { getByText } = renderWithFormProvider(
        <FormDropdown name="category" options={defaultOptions} />,
        { category: '' },
        {
          pristine: false,
          validated: false,
          validationErrors: { category: 'Category is required' }
        }
      );

      expect(getByText('Category is required')).toBeInTheDocument();
    });

    it('should apply isInvalid class when validation fails', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormDropdown name="category" options={defaultOptions} />,
        { category: '' },
        {
          pristine: false,
          validated: false,
          validationErrors: { category: 'Category is required' }
        }
      );

      expect(getByLabelText('Category *')).toHaveClass('is-invalid');
    });

    it('should handle string options', () => {
      const stringOptions = ['red', 'green', 'blue'];
      const { getByRole } = renderWithFormProvider(
        <FormDropdown name="category" options={stringOptions} />
      );

      const select = getByRole('combobox');
      const options = select.querySelectorAll('option');
      
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('red');
      expect(options[0]).toHaveValue('red');
    });
  });
});
