import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from 'react-bootstrap';
import { FormModal } from '../../../src/components/forms/FormModal';
import { FormProvider } from '../../../src/components/forms/FormProvider';
import { FormInput } from '../../../src/components/forms/fields/FormInput';
import { FormRadioGroup } from '../../../src/components/forms/fields/FormRadioGroup';
import { userFormFields, validateUser } from './userFormFields';

/**
 * A modal with a form, inside a `FormProvider`. Without children it renders every field of `formFields`. The Save
 * button submits the form; the button texts default to the localized "Save" and "Close".
 *
 * Click the button in a story to open the modal.
 */
const meta = {
  title: 'Components/Forms/FormModal',
  component: FormModal,
  args: {
    modalTitle: 'Edit user',
    onHide: fn(),
  },
  argTypes: {
    modalTitle: { control: 'text' },
    submitText: { control: 'text' },
    cancelText: { control: 'text' },
    width: { control: 'select', options: [undefined, 25, 50, 75, 100] },
    show: { control: false },
    children: { control: false },
  },
  render: function Render({ onHide, children, ...args }) {
    const [show, setShow] = useState(false);
    const [saved, setSaved] = useState<object | null>(null);
    const hide = () => {
      onHide();
      setShow(false);
    };
    return (
      <>
        <Button onClick={() => setShow(true)}>Open modal</Button>
        {saved && <pre className="small bg-light border p-2 mt-3">{JSON.stringify(saved, null, 2)}</pre>}
        {show && (
          <FormProvider
            formFields={userFormFields}
            initialState={{ name: 'Alice Brown', email: 'alice.brown@example.com' }}
            validate={validateUser}
            onSubmit={(data, callback) => {
              setSaved(data);
              callback?.();
              setShow(false);
            }}
          >
            <FormModal {...args} show onHide={hide}>{children}</FormModal>
          </FormProvider>
        )}
      </>
    );
  },
} satisfies Meta<typeof FormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTexts: Story = {
  args: { submitText: 'Save user', cancelText: 'Discard', width: 75 },
};

/** With children the modal shows those instead of all fields. */
export const CustomContent: Story = {
  args: {
    modalTitle: 'Change status',
    children: (
      <>
        <p className="text-muted">Only the status of Alice Brown changes.</p>
        <FormRadioGroup name="status" options={userFormFields.status.options} />
        <FormInput name="notes" as="textarea" rows={2} />
      </>
    ),
  },
};
