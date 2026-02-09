import { fireEvent, waitFor, screen } from '@testing-library/react';

/**
 * Form interaction helpers
 */
export const formHelpers = {
  /**
   * Fill a form field by label text
   */
  fillField: (labelText: string | RegExp, value: string) => {
    const field = screen.getByLabelText(labelText);
    fireEvent.change(field, { target: { value } });
    return field;
  },

  /**
   * Click a checkbox by label text
   */
  toggleCheckbox: (labelText: string) => {
    const checkbox = screen.getByLabelText(labelText);
    fireEvent.click(checkbox);
    return checkbox;
  },

  /**
   * Submit a form by clicking submit button
   */
  submitForm: (buttonText: string = 'Submit') => {
    const submitButton = screen.getByRole('button', { name: buttonText });
    fireEvent.click(submitButton);
    return submitButton;
  },

  /**
   * Submit form using data-testid
   */
  submitFormById: (testId: string) => {
    const submitButton = screen.getByTestId(testId);
    fireEvent.click(submitButton);
    return submitButton;
  },

  /**
   * Select an option from a dropdown
   */
  selectOption: (labelText: string, optionText: string) => {
    const select = screen.getByLabelText(labelText);
    fireEvent.change(select, { target: { value: optionText } });
    return select;
  }
};

/**
 * Validation testing helpers
 */
export const validationHelpers = {
  /**
   * Expect validation error to be shown
   */
  expectValidationError: (errorText: string) => {
    expect(screen.getByText(errorText)).toBeInTheDocument();
  },

  /**
   * Expect validation error NOT to be shown
   */
  expectNoValidationError: (errorText: string) => {
    expect(screen.queryByText(errorText)).not.toBeInTheDocument();
  },

  /**
   * Expect field to have invalid class
   */
  expectFieldInvalid: (labelText: string) => {
    const field = screen.getByLabelText(labelText);
    expect(field).toHaveClass('is-invalid');
  },

  /**
   * Expect field NOT to have invalid class
   */
  expectFieldValid: (labelText: string) => {
    const field = screen.getByLabelText(labelText);
    expect(field).not.toHaveClass('is-invalid');
  },

  /**
   * Test form submission with validation
   */
  testFormSubmissionWithValidation: async (
    fillFormFn: () => void,
    submitFn: () => void,
    expectSubmitCalled: boolean,
    mockSubmit: jest.Mock
  ) => {
    fillFormFn();
    submitFn();
    
    if (expectSubmitCalled) {
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
    } else {
      expect(mockSubmit).not.toHaveBeenCalled();
    }
  }
};

/**
 * Modal testing helpers
 */
export const modalHelpers = {
  /**
   * Expect modal to be open
   */
  expectModalOpen: (titleText?: string) => {
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    
    if (titleText) {
      expect(screen.getByText(titleText)).toBeInTheDocument();
    }
  },

  /**
   * Expect modal to be closed
   */
  expectModalClosed: (titleText?: string) => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    if (titleText) {
      expect(screen.queryByText(titleText)).not.toBeInTheDocument();
    }
  },

  /**
   * Close modal using close button
   */
  closeModal: () => {
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
  },

  /**
   * Close modal using cancel button
   */
  cancelModal: (cancelText: string = 'Cancel') => {
    const cancelButton = screen.getByText(cancelText);
    fireEvent.click(cancelButton);
  }
};

/**
 * Badge selection helpers
 */
export const badgeHelpers = {
  /**
   * Click a badge by text
   */
  clickBadge: (badgeText: string) => {
    const badge = screen.getByText(badgeText);
    fireEvent.click(badge);
    return badge;
  },

  /**
   * Expect badge to have specific styling
   */
  expectBadgeSelected: (badgeText: string) => {
    const badge = screen.getByText(badgeText);
    expect(badge).toHaveClass('badge-primary');
  },

  /**
   * Expect badge to have secondary styling (not selected)
   */
  expectBadgeNotSelected: (badgeText: string) => {
    const badge = screen.getByText(badgeText);
    expect(badge).toHaveClass('badge-secondary');
  }
};

/**
 * Accessibility testing helpers
 */
export const a11yHelpers = {
  /**
   * Expect field to be properly associated with label
   */
  expectProperLabelAssociation: (labelText: string | RegExp, expectedIdPattern?: RegExp) => {
    const field = screen.getByLabelText(labelText);
    expect(field).toBeInTheDocument();
    
    if (expectedIdPattern) {
      expect(field).toHaveAttribute('id', expect.stringMatching(expectedIdPattern));
    }
  },

  /**
   * Expect element to have proper ARIA attributes
   */
  expectAriaAttributes: (element: HTMLElement, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([attr, value]) => {
      expect(element).toHaveAttribute(attr, value);
    });
  }
};

/**
 * Component rendering helpers
 */
export const renderHelpers = {
  /**
   * Expect component to render without crashing
   */
  expectNoRenderError: (renderFn: () => void) => {
    expect(renderFn).not.toThrow();
  },

  /**
   * Expect component to be valid React component
   */
  expectValidReactComponent: (Component: any) => {
    expect(typeof Component).toBe('function');
  }
};
