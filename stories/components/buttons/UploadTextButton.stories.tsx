import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { UploadTextButton } from '../../../src/components/buttons/IconButtons';

/** Opens a file dialog and passes the contents of the chosen file, read as text, to `onLoadFile`. */
const meta = {
  title: 'Components/Buttons/UploadTextButton',
  component: UploadTextButton,
  args: {
    accept: '.txt,.csv,.json',
    children: 'Upload text file',
    variant: 'outline-primary',
    onLoadFile: fn(),
  },
  argTypes: {
    children: { control: 'text' },
  },
  render: function Render({ onLoadFile, ...args }) {
    const [contents, setContents] = useState<string | null>(null);
    return (
      <>
        <UploadTextButton
          {...args}
          onLoadFile={(result) => {
            onLoadFile(result);
            setContents(String(result));
          }}
        />
        {contents !== null && <pre className="mt-3 p-2 bg-light border small">{contents.slice(0, 2000)}</pre>}
      </>
    );
  },
} satisfies Meta<typeof UploadTextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
