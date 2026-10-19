import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { useArgs } from 'storybook/preview-api';
import { Breadcrumb, Nav } from 'react-bootstrap';
import { NavLinks, NavItem } from '../../../src/components/navigation/NavLinks';

const items: NavItem[] = [
  { path: 'dashboard', title: 'Dashboard' },
  {
    path: 'employees',
    title: 'Employees',
    children: [
      { path: 'list', title: 'All employees' },
      { path: 'teams', title: 'Teams', children: [{ path: 'new', title: 'New team' }] },
    ],
  },
  { path: 'projects', title: 'Projects', children: [{ path: 'archive', title: 'Archive' }] },
  { path: 'settings', title: 'Settings' },
];

/**
 * Navigation links from a tree of `items`. The children of an item show when `pathname` is inside it. Pass the
 * router's link as `LinkComponent` (for example react-router's `Link`) and the current path as `pathname`.
 *
 * In these stories a link sets the `pathname` arg instead of navigating: click around.
 */
const meta = {
  title: 'Components/Navigation/NavLinks',
  component: NavLinks,
  args: {
    items,
    pathname: '/employees/teams',
    indent: 20,
    onClick: fn(),
    LinkComponent: () => null,
  },
  argTypes: {
    LinkComponent: { control: false },
    renderBreadcrumb: { control: false },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const LinkComponent = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
      <a
        href={to}
        className={`${className ?? ''} ${args.pathname === to ? 'active fw-bold' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          updateArgs({ pathname: to });
        }}
      >
        {children}
      </a>
    );
    return (
      <Nav className="flex-column" style={{ maxWidth: 300 }}>
        <NavLinks {...args} LinkComponent={LinkComponent} />
      </Nav>
    );
  },
} satisfies Meta<typeof NavLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TopLevel: Story = {
  args: { pathname: '/dashboard' },
};

/** `renderBreadcrumb` gets the trail to the current page and renders it below the active link. */
export const WithBreadcrumb: Story = {
  args: {
    renderBreadcrumb: (trail) => (
      <Breadcrumb className="small ms-3">
        {trail.map(({ path, title }) => <Breadcrumb.Item key={path} active>{title}</Breadcrumb.Item>)}
      </Breadcrumb>
    ),
  },
};
