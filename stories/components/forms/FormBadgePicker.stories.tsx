import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormBadgePicker } from '../../../src/components/forms/fields/FormBadgePicker';
import { withFormProvider } from './withFormProvider';

const skills = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'django', label: 'Django' },
  { value: 'sql', label: 'SQL' },
  { value: 'cobol', label: 'COBOL', disabled: true },
];

/**
 * The chosen items as badges, with a dropdown to add more. `multiple` allows several items (the value is an array);
 * without it the value is a single item's value. Items are `{ value, label }`, or use `idKey` for another key.
 */
const meta = {
  title: 'Components/Forms/FormBadgePicker',
  component: FormBadgePicker,
  decorators: [withFormProvider],
  args: {
    name: 'skills',
    label: 'Skills',
    list: skills,
    multiple: true,
    required: false,
    disabled: false,
    integer: false,
  },
  argTypes: {
    label: { control: 'text' },
    toggleText: { control: 'text' },
    emptyText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof FormBadgePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  parameters: { initialValue: ['react', 'sql'] },
};

export const Single: Story = {
  args: { name: 'main_skill', label: 'Main skill', multiple: false },
  parameters: { initialValue: 'python' },
};

export const CustomTexts: Story = {
  args: { toggleText: 'Add skill', emptyText: 'No skills yet' },
};
