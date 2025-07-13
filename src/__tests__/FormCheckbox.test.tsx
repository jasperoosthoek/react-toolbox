import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { FormCheckbox, FormSwitch } from '../components/forms/fields/FormCheckbox';
import { FormProvider } from '../components/forms/FormProvider';

describe('FormCheckbox and FormSwitch', () => {
  const mockFormFields = {
    agree: {
      label: 'I agree to terms',
      required: true,
      formProps: { 'data-testid': 'checkbox-input' },
    },
    notifications: {
      label: 'Enable notifications',
      required: false,
      formProps: { 'data-testid': 'switch-input' },
    },
  };

  const mockFormValues = {
    agree: true,
    notifications: false,
  };

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

  describe('FormCheckbox', () => {
    it('should render checkbox with label', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormCheckbox name="agree" />
      );

      const checkbox = getByLabelText('I agree to terms *');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('should be checked when value is true', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormCheckbox name="agree" />
      );

      expect(getByLabelText('I agree to terms *')).toBeChecked();
    });

    it('should be unchecked when value is false', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormCheckbox name="notifications" />
      );

      expect(getByLabelText('Enable notifications')).not.toBeChecked();
    });

    it('should handle change events', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormCheckbox name="agree" />
      );

      const checkbox = getByLabelText('I agree to terms *');
      fireEvent.click(checkbox);

      expect(checkbox).not.toBeChecked();
    });

    it('should handle undefined/null values as false', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormCheckbox name="agree" />,
        { agree: undefined }
      );

      expect(getByLabelText('I agree to terms *')).not.toBeChecked();
    });

    it('should display custom label when provided', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormCheckbox name="agree" label="Custom label" />
      );

      expect(getByLabelText('Custom label *')).toBeInTheDocument();
    });

    it('should not show asterisk for non-required fields', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormCheckbox name="notifications" />
      );

      expect(getByLabelText('Enable notifications')).toBeInTheDocument();
    });

    it('should show validation error when invalid', () => {
      const { getByText } = renderWithFormProvider(
        <FormCheckbox name="agree" />,
        { agree: false },
        {
          pristine: false,
          validated: false,
          validationErrors: { agree: 'You must agree to terms' }
        }
      );

      expect(getByText('You must agree to terms')).toBeInTheDocument();
    });

    it('should apply isInvalid class when validation fails', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormCheckbox name="agree" />,
        { agree: false },
        {
          pristine: false,
          validated: false,
          validationErrors: { agree: 'You must agree to terms' }
        }
      );

      expect(getByLabelText('I agree to terms *')).toHaveClass('is-invalid');
    });

    it('should merge form props with component props', () => {
      const { getByTestId } = renderWithFormProvider(
        <FormCheckbox name="agree" />
      );

      expect(getByTestId('checkbox-input')).toBeInTheDocument();
    });

    it('should handle ReactElement labels', () => {
      const customLabel = <span data-testid="custom-label">Custom React Label</span>;
      const { getByTestId } = renderWithFormProvider(
        <FormCheckbox name="agree" label={customLabel} />
      );

      expect(getByTestId('custom-label')).toBeInTheDocument();
    });
  });

  describe('FormSwitch', () => {
    it('should render switch with label', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormSwitch name="notifications" />
      );

      const switchElement = getByLabelText('Enable notifications');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute('type', 'checkbox');
    });

    it('should be checked when value is true', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormSwitch name="agree" />
      );

      expect(getByLabelText('I agree to terms *')).toBeChecked();
    });

    it('should handle change events', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormSwitch name="notifications" />
      );

      const switchElement = getByLabelText('Enable notifications');
      fireEvent.click(switchElement);

      expect(switchElement).toBeChecked();
    });

    it('should show validation error when invalid', () => {
      const { getByText } = renderWithFormProvider(
        <FormSwitch name="agree" />,
        { agree: false },
        {
          pristine: false,
          validated: false,
          validationErrors: { agree: 'You must agree to terms' }
        }
      );

      expect(getByText('You must agree to terms')).toBeInTheDocument();
    });

    it('should handle custom label override', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormSwitch name="notifications" label="Custom Switch Label" />
      );

      expect(getByLabelText('Custom Switch Label')).toBeInTheDocument();
    });
  });
});
