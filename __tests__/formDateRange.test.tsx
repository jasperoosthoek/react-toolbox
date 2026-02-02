import React from 'react';
import { LocalizationProvider } from '../src/localization/LocalizationContext';
import { FormProvider, useForm } from '../src/components/forms/FormProvider';
import { FormError } from '../src/components/forms/fields/FormError';
import { FormDateRange } from '../src/components/forms/fields/FormDateRange';
import {
  renderWithLocalization,
  renderWithFormProvider,
  render,
  fireEvent,
  screen
} from './utils';

describe('FormError Component', () => {
  it('should render error message with leading space', () => {
    renderWithLocalization(<FormError error="required" />);
    const errorElement = screen.getByText(/required/);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(' required');
  });

  it('should return null when error is null', () => {
    const { container } = renderWithLocalization(<FormError error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should apply custom id when provided', () => {
    renderWithLocalization(<FormError error="test error" id="custom-error-id" />);
    const errorElement = screen.getByText(/test error/);
    expect(errorElement).toHaveAttribute('id', 'custom-error-id');
  });

  it('should render as Form.Text element', () => {
    const { container } = renderWithLocalization(<FormError error="error message" />);
    const errorElement = container.querySelector('.form-text');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('error message');
  });
});

describe('FormDateRange Component', () => {
  describe('Basic Rendering', () => {
    it('should render two date inputs', () => {
      const { container } = renderWithFormProvider(
        <FormDateRange name="dates" label="Date Range" />,
        { initialState: { dates: { from: '', to: '' } } }
      );

      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs).toHaveLength(2);
    });

    it('should render localized labels (From/To)', () => {
      renderWithFormProvider(
        <FormDateRange name="dates" label="Date Range" />,
        { initialState: { dates: { from: '', to: '' } } }
      );

      expect(screen.getByText('From')).toBeInTheDocument();
      expect(screen.getByText('To')).toBeInTheDocument();
    });

    it('should render main label with asterisk when required', () => {
      renderWithFormProvider(
        <FormDateRange name="dates" label="Date Range" required />,
        { initialState: { dates: { from: '', to: '' } } }
      );

      expect(screen.getByText(/Date Range/)).toBeInTheDocument();
      expect(screen.getByText('*', { exact: false })).toBeInTheDocument();
    });

    it('should render default separator', () => {
      const { container } = renderWithFormProvider(
        <FormDateRange name="dates" label="Date Range" />,
        { initialState: { dates: { from: '', to: '' } } }
      );

      // FaArrowRight icon should be present
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render custom separator when provided', () => {
      renderWithFormProvider(
        <FormDateRange
          name="dates"
          label="Date Range"
          separator={<span data-testid="custom-separator">→</span>}
        />,
        { initialState: { dates: { from: '', to: '' } } }
      );

      expect(screen.getByTestId('custom-separator')).toBeInTheDocument();
    });

    it('should hide separator when set to null', () => {
      const { container } = renderWithFormProvider(
        <FormDateRange name="dates" label="Date Range" separator={null} />,
        { initialState: { dates: { from: '', to: '' } } }
      );

      // No SVG icon should be present
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('Value Handling', () => {
    it('should display initial values correctly', () => {
      const { container } = renderWithFormProvider(
        <FormDateRange name="dates" label="Date Range" />,
        { initialState: { dates: { from: '2024-01-15', to: '2024-01-31' } } }
      );

      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs[0]).toHaveValue('2024-01-15');
      expect(dateInputs[1]).toHaveValue('2024-01-31');
    });

    it('should use custom keys when provided', () => {
      const { container } = renderWithFormProvider(
        <FormDateRange name="timeline" label="Timeline" fromKey="start" toKey="end" />,
        { initialState: { timeline: { start: '2024-06-01', end: '2024-06-30' } } }
      );

      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs[0]).toHaveValue('2024-06-01');
      expect(dateInputs[1]).toHaveValue('2024-06-30');
    });

    it('should handle onChange for from date', () => {
      const mockSubmit = jest.fn();

      const { container } = renderWithFormProvider(
        <FormDateRange name="dates" label="Date Range" />,
        {
          initialState: { dates: { from: '', to: '' } },
          onSubmit: mockSubmit
        }
      );

      const dateInputs = container.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: '2024-03-15' } });

      expect(dateInputs[0]).toHaveValue('2024-03-15');
    });

    it('should handle onChange for to date', () => {
      const mockSubmit = jest.fn();

      const { container } = renderWithFormProvider(
        <FormDateRange name="dates" label="Date Range" />,
        {
          initialState: { dates: { from: '2024-01-01', to: '' } },
          onSubmit: mockSubmit
        }
      );

      const dateInputs = container.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[1], { target: { value: '2024-03-31' } });

      expect(dateInputs[1]).toHaveValue('2024-03-31');
    });
  });

  describe('Required Field Validation', () => {
    it('should NOT show validation errors when pristine', () => {
      renderWithFormProvider(
        <FormDateRange name="dates" label="Date Range" required />,
        { initialState: { dates: { from: '', to: '' } } }
      );

      // Validation errors should not be visible initially
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });

    it('should show validation errors for both fields after submit attempt', () => {
      const mockSubmit = jest.fn();

      const TestFormWithSubmit = () => {
        const { submit } = useForm();
        return (
          <>
            <FormDateRange name="dates" label="Date Range" required />
            <button data-testid="submit-btn" onClick={submit}>Submit</button>
          </>
        );
      };

      render(
        <LocalizationProvider>
          <FormProvider
            formFields={{ dates: { label: 'Date Range', required: true } }}
            initialState={{ dates: { from: '', to: '' } }}
            onSubmit={mockSubmit}
          >
            <TestFormWithSubmit />
          </FormProvider>
        </LocalizationProvider>
      );

      // Submit to make form non-pristine
      fireEvent.click(screen.getByTestId('submit-btn'));

      // Both required errors should be visible
      const requiredErrors = screen.getAllByText(/required/i);
      expect(requiredErrors.length).toBeGreaterThanOrEqual(2);
    });

    it('should only show error for empty from field when to is filled', () => {
      const mockSubmit = jest.fn();

      const TestFormWithSubmit = () => {
        const { submit } = useForm();
        return (
          <>
            <FormDateRange name="dates" label="Date Range" required />
            <button data-testid="submit-btn" onClick={submit}>Submit</button>
          </>
        );
      };

      render(
        <LocalizationProvider>
          <FormProvider
            formFields={{ dates: { label: 'Date Range', required: true } }}
            initialState={{ dates: { from: '', to: '2024-12-31' } }}
            onSubmit={mockSubmit}
          >
            <TestFormWithSubmit />
          </FormProvider>
        </LocalizationProvider>
      );

      fireEvent.click(screen.getByTestId('submit-btn'));

      // Only one required error should be visible (for the from field)
      const requiredErrors = screen.getAllByText(/required/i);
      expect(requiredErrors).toHaveLength(1);
    });

    it('should apply isInvalid class to empty required fields after submit', () => {
      const mockSubmit = jest.fn();

      const TestFormWithSubmit = () => {
        const { submit } = useForm();
        return (
          <>
            <FormDateRange name="dates" label="Date Range" required />
            <button data-testid="submit-btn" onClick={submit}>Submit</button>
          </>
        );
      };

      const { container } = render(
        <LocalizationProvider>
          <FormProvider
            formFields={{ dates: { label: 'Date Range', required: true } }}
            initialState={{ dates: { from: '', to: '' } }}
            onSubmit={mockSubmit}
          >
            <TestFormWithSubmit />
          </FormProvider>
        </LocalizationProvider>
      );

      fireEvent.click(screen.getByTestId('submit-btn'));

      const invalidInputs = container.querySelectorAll('.is-invalid');
      expect(invalidInputs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Date Order Validation', () => {
    it('should show error when to date is before from date', () => {
      const mockSubmit = jest.fn();

      const TestFormWithSubmit = () => {
        const { submit } = useForm();
        return (
          <>
            <FormDateRange name="dates" label="Date Range" />
            <button data-testid="submit-btn" onClick={submit}>Submit</button>
          </>
        );
      };

      render(
        <LocalizationProvider>
          <FormProvider
            formFields={{ dates: { label: 'Date Range' } }}
            initialState={{ dates: { from: '2024-06-15', to: '2024-06-10' } }}
            onSubmit={mockSubmit}
          >
            <TestFormWithSubmit />
          </FormProvider>
        </LocalizationProvider>
      );

      fireEvent.click(screen.getByTestId('submit-btn'));

      expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
    });

    it('should NOT show date order error when dates are valid', () => {
      const mockSubmit = jest.fn();

      const TestFormWithSubmit = () => {
        const { submit } = useForm();
        return (
          <>
            <FormDateRange name="dates" label="Date Range" />
            <button data-testid="submit-btn" onClick={submit}>Submit</button>
          </>
        );
      };

      render(
        <LocalizationProvider>
          <FormProvider
            formFields={{ dates: { label: 'Date Range' } }}
            initialState={{ dates: { from: '2024-06-01', to: '2024-06-30' } }}
            onSubmit={mockSubmit}
          >
            <TestFormWithSubmit />
          </FormProvider>
        </LocalizationProvider>
      );

      fireEvent.click(screen.getByTestId('submit-btn'));

      expect(screen.queryByText(/end date must be after start date/i)).not.toBeInTheDocument();
    });

    it('should apply isInvalid to both inputs when date order is invalid', () => {
      const mockSubmit = jest.fn();

      const TestFormWithSubmit = () => {
        const { submit } = useForm();
        return (
          <>
            <FormDateRange name="dates" label="Date Range" />
            <button data-testid="submit-btn" onClick={submit}>Submit</button>
          </>
        );
      };

      const { container } = render(
        <LocalizationProvider>
          <FormProvider
            formFields={{ dates: { label: 'Date Range' } }}
            initialState={{ dates: { from: '2024-12-31', to: '2024-01-01' } }}
            onSubmit={mockSubmit}
          >
            <TestFormWithSubmit />
          </FormProvider>
        </LocalizationProvider>
      );

      fireEvent.click(screen.getByTestId('submit-btn'));

      const invalidInputs = container.querySelectorAll('.is-invalid');
      expect(invalidInputs).toHaveLength(2);
    });
  });

  describe('Integration with FormProvider', () => {
    it('should submit form with correct values', () => {
      const mockSubmit = jest.fn();

      const TestFormWithSubmit = () => {
        const { submit } = useForm();
        return (
          <>
            <FormDateRange name="dates" label="Date Range" />
            <button data-testid="submit-btn" onClick={submit}>Submit</button>
          </>
        );
      };

      render(
        <LocalizationProvider>
          <FormProvider
            formFields={{ dates: { label: 'Date Range' } }}
            initialState={{ dates: { from: '2024-01-01', to: '2024-12-31' } }}
            onSubmit={mockSubmit}
          >
            <TestFormWithSubmit />
          </FormProvider>
        </LocalizationProvider>
      );

      fireEvent.click(screen.getByTestId('submit-btn'));

      expect(mockSubmit).toHaveBeenCalledWith(
        { dates: { from: '2024-01-01', to: '2024-12-31' } },
        expect.any(Function)
      );
    });

  });
});
