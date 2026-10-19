import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormBadgesSelection } from '../../../src/components/forms/fields/FormBadgesSelection';
import { withFormProvider } from './withFormProvider';

/** All items as badges; click a badge to select or deselect it. */
const meta = {
  title: 'Components/Forms/FormBadgesSelection',
  component: FormBadgesSelection,
  decorators: [withFormProvider],
  args: {
    name: 'tags',
    label: 'Tags',
    list: [
      { value: 'urgent', label: 'Urgent' },
      { value: 'bug', label: 'Bug' },
      { value: 'feature', label: 'Feature' },
      { value: 'docs', label: 'Documentation' },
    ],
    multiple: true,
    required: false,
    disabled: false,
    integer: false,
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof FormBadgesSelection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  parameters: { initialValue: ['bug'] },
};

export const Single: Story = {
  args: { name: 'priority', label: 'Priority', multiple: false },
  parameters: { initialValue: 'urgent' },
};
