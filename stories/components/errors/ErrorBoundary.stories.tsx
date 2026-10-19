import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, Button } from 'react-bootstrap';
import { ErrorBoundary, dispatchError, useError } from '../../../src/components/errors/ErrorBoundary';
import { ErrorPage } from '../../../src/components/errors/Errors';

const ErrorMessage = () => {
  const { error, clearError } = useError();
  if (!error) return <p className="text-muted">No error.</p>;
  return (
    <Alert variant="danger" dismissible onClose={clearError}>
      {typeof error === 'string' ? error : error.message ?? JSON.stringify(error)}
    </Alert>
  );
};

/**
 * Catches errors sent with `dispatchError(error)` from anywhere, including code outside React such as an API client,
 * and gives them to the components inside it through `useError()`: `{ error, clearError }`. Wrap the application
 * once.
 */
const meta = {
  title: 'Components/Errors/ErrorBoundary',
  component: ErrorBoundary,
  args: { children: null },
  argTypes: { children: { control: false } },
  render: (args) => (
    <ErrorBoundary {...args}>
      <div className="d-flex gap-2 mb-3">
        <Button variant="outline-danger" onClick={() => dispatchError('The server could not be reached.')}>
          dispatchError(message)
        </Button>
        <Button
          variant="outline-danger"
          onClick={() => dispatchError(new Error('Request failed with status code 500'))}
        >
          dispatchError(new Error(...))
        </Button>
      </div>
      <ErrorMessage />
    </ErrorBoundary>
  ),
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `ErrorPage` is a full-width block for an error that replaces the page content. */
export const ErrorPageBlock: Story = {
  name: 'ErrorPage',
  parameters: { controls: { disable: true } },
  render: () => (
    <ErrorPage>
      <h4>Page not found</h4>
      <p className="mb-0">The page you are looking for does not exist.</p>
    </ErrorPage>
  ),
};
