import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { FormInput } from '../components/forms/fields/FormInput';
import { FormProvider } from '../components/forms/FormProvider';

describe('FormInput', () => {
  const mockFormFields = {
    username: {
      label: 'Username',
      required: true,
      formProps: { placeholder: 'Enter username', 'data-testid': 'input-field' },
    },
    email: {
      label: 'Email',
      required: false,
      formProps: { type: 'email' },
    },
    password: {
      label: 'Password',
      required: true,
      formProps: { type: 'password' },
    },
  };

  const mockFormValues = {
    username: 'testuser',
    email: 'test@example.com',
    password: '',
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

  describe('Basic Functionality', () => {
    it('should render input with label', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />
      );

      const input = getByLabelText('Username *');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('should show current value', () => {
      const { getByDisplayValue } = renderWithFormProvider(
        <FormInput name="username" />
      );

      expect(getByDisplayValue('testuser')).toBeInTheDocument();
    });

    it('should handle change events', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />
      );

      const input = getByLabelText('Username *');
      fireEvent.change(input, { target: { value: 'newuser' } });

      expect(input).toHaveValue('newuser');
    });

    it('should not show asterisk for non-required fields', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="email" />
      );

      expect(getByLabelText('Email')).toBeInTheDocument();
    });

    it('should override required from component props', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="email" required={true} />
      );

      expect(getByLabelText('Email *')).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('should handle password type', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="password" />
      );

      const input = getByLabelText('Password *');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should handle email type', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="email" />
      );

      const input = getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should default to text type when not specified', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />
      );

      const input = getByLabelText('Username *');
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  describe('Custom Labels', () => {
    it('should display custom label when provided', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" label="Custom Label" />
      );

      expect(getByLabelText('Custom Label *')).toBeInTheDocument();
    });

    it('should handle ReactElement labels', () => {
      const customLabel = <span data-testid="custom-label">Custom React Label</span>;
      const { getByTestId } = renderWithFormProvider(
        <FormInput name="username" label={customLabel} />
      );

      expect(getByTestId('custom-label')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show validation error when invalid', () => {
      const { getByText } = renderWithFormProvider(
        <FormInput name="username" />,
        { username: '' },
        {
          pristine: false,
          validated: false,
          validationErrors: { username: 'Username is required' }
        }
      );

      expect(getByText('Username is required')).toBeInTheDocument();
    });

    it('should not show validation error when pristine', () => {
      const { queryByText } = renderWithFormProvider(
        <FormInput name="username" />,
        { username: '' },
        {
          pristine: true,
          validated: false,
          validationErrors: { username: 'Username is required' }
        }
      );

      expect(queryByText('Username is required')).not.toBeInTheDocument();
    });

    it('should apply isInvalid class when validation fails', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />,
        { username: '' },
        {
          pristine: false,
          validated: false,
          validationErrors: { username: 'Username is required' }
        }
      );

      expect(getByLabelText('Username *')).toHaveClass('is-invalid');
    });

    it('should not show validation error when validated successfully', () => {
      const { queryByText } = renderWithFormProvider(
        <FormInput name="username" />,
        { username: '' },
        {
          pristine: false,
          validated: true,
          validationErrors: { username: 'Username is required' }
        }
      );

      expect(queryByText('Username is required')).not.toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should merge form props', () => {
      const { getByTestId } = renderWithFormProvider(
        <FormInput name="username" />
      );

      expect(getByTestId('input-field')).toBeInTheDocument();
    });

    it('should handle additional HTML props', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput 
          name="username" 
          disabled={true}
          className="custom-class"
          maxLength={10}
        />
      );

      const input = getByLabelText('Username *');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('should set controlId to field name', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />
      );

      const input = getByLabelText('Username *');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('should merge placeholder from form props', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />
      );

      const input = getByLabelText('Username *');
      expect(input).toHaveAttribute('placeholder', 'Enter username');
    });

    it('should override form props with component props', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" placeholder="Override placeholder" />
      );

      const input = getByLabelText('Username *');
      expect(input).toHaveAttribute('placeholder', 'Override placeholder');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />,
        { username: undefined }
      );

      const input = getByLabelText('Username *');
      expect(input).toHaveValue('');
    });

    it('should handle null value', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />,
        { username: null }
      );

      const input = getByLabelText('Username *');
      expect(input).toHaveValue('');
    });

    it('should handle numeric values', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />,
        { username: 123 }
      );

      const input = getByLabelText('Username *');
      expect(input).toHaveValue('123');
    });

    it('should handle empty string value', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />,
        { username: '' }
      );

      const input = getByLabelText('Username *');
      expect(input).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-describedby when error exists', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />,
        { username: '' },
        {
          pristine: false,
          validated: false,
          validationErrors: { username: 'Username is required' }
        }
      );

      const input = getByLabelText('Username *');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('should have proper id and htmlFor association', () => {
      const { getByLabelText } = renderWithFormProvider(
        <FormInput name="username" />
      );

      const input = getByLabelText('Username *');
      const label = document.querySelector('label[for="username"]');
      
      expect(input).toHaveAttribute('id', 'username');
      expect(label).toBeInTheDocument();
    });
  });
});
