import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormFile, UploadFunction } from '../../../src/components/forms/fields/FormFile';
import { withFormProvider } from './withFormProvider';

// Pretends to upload in about a second, reporting progress; nothing leaves the browser
const fakeUpload: UploadFunction = (file, onProgress) => new Promise((resolve) => {
  let progress = 0;
  const timer = setInterval(() => {
    progress += 20;
    onProgress(progress);
    if (progress >= 100) {
      clearInterval(timer);
      resolve({ path: `/uploads/${file.name}` });
    }
  }, 200);
});

/**
 * Choose or drop files; each one is uploaded right away with `onUpload`, which reports progress and returns the
 * server path. The value is a list of `{ path, name, size, previewUrl }`.
 */
const meta = {
  title: 'Components/Forms/FormFile',
  component: FormFile,
  decorators: [withFormProvider],
  args: {
    name: 'attachments',
    label: 'Attachments',
    multiple: true,
    onUpload: fakeUpload,
  },
  argTypes: {
    label: { control: 'text' },
    accept: { control: 'text' },
    maxSize: { control: 'number' },
    onUpload: { control: false },
  },
} satisfies Meta<typeof FormFile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleImage: Story = {
  args: { name: 'photo', label: 'Photo', multiple: false, accept: 'image/*', maxSize: 2 * 1024 * 1024 },
};
