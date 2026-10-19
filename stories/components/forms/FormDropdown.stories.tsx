import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormDropdown } from '../../../src/components/forms/fields/FormDropdown';
import { withFormProvider } from './withFormProvider';
import { mockUsers } from '../../../examples/data/mockData';

/**
 * A dropdown that picks one item from `list` (or `options`). Items are `{ value, label }`, plain strings, or any
 * object with `idKey` and `nameKey`.
 */
const meta = {
  title: 'Components/Forms/FormDropdown',
  component: FormDropdown<any>,
  decorators: [withFormProvider],
  args: {
    name: 'country',
    label: 'Country',
    list: ['Netherlands', 'Belgium', 'France', 'Germany'],
    required: false,
    disabled: false,
    unselectedOptionLabel: true,
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    unselectedOptionLabel: { control: 'text' },
  },
} satisfies Meta<typeof FormDropdown<any>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  parameters: { initialValue: 'France' },
};

/** Objects with their own keys: `idKey="id"` and `nameKey="name"`. */
export const ObjectList: Story = {
  args: {
    name: 'manager_id',
    label: 'Manager',
    list: mockUsers.slice(0, 10),
    idKey: 'id',
    nameKey: 'name',
  },
};
