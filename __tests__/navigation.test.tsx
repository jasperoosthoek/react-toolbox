import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavLinks, NavItem } from '../src/components/navigation/NavLinks';

// Mock Link component that simulates router behavior
const MockLinkComponent = ({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <a href={to} className={className} data-testid={`link-${to}`}>
    {children}
  </a>
);

describe('NavLinks Component', () => {
  const mockOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should be a valid React component', () => {
      expect(typeof NavLinks).toBe('function');
    });

    it('should render without crashing', () => {
      const items: NavItem[] = [{ path: 'home', title: 'Home' }];

      expect(() => {
        render(
          <NavLinks
            items={items}
            pathname="/home"
            LinkComponent={MockLinkComponent}
          />
        );
      }).not.toThrow();
    });

    it('should render single nav item', () => {
      const items: NavItem[] = [{ path: 'home', title: 'Home' }];

      render(
        <NavLinks
          items={items}
          pathname="/home"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should render multiple nav items', () => {
      const items: NavItem[] = [
        { path: 'home', title: 'Home' },
        { path: 'about', title: 'About' },
        { path: 'contact', title: 'Contact' },
      ];

      render(
        <NavLinks
          items={items}
          pathname="/home"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render links with correct paths', () => {
      const items: NavItem[] = [
        { path: 'home', title: 'Home' },
        { path: 'about', title: 'About' },
      ];

      render(
        <NavLinks
          items={items}
          pathname="/home"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.getByTestId('link-/home')).toHaveAttribute('href', '/home');
      expect(screen.getByTestId('link-/about')).toHaveAttribute('href', '/about');
    });
  });

  describe('Nested Navigation', () => {
    const nestedItems: NavItem[] = [
      {
        path: 'products',
        title: 'Products',
        children: [
          { path: 'electronics', title: 'Electronics' },
          { path: 'clothing', title: 'Clothing' },
        ],
      },
      { path: 'about', title: 'About' },
    ];

    it('should render children when parent is active', () => {
      render(
        <NavLinks
          items={nestedItems}
          pathname="/products"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
    });

    it('should not render children when parent is not active', () => {
      render(
        <NavLinks
          items={nestedItems}
          pathname="/about"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
      expect(screen.queryByText('Clothing')).not.toBeInTheDocument();
    });

    it('should render children when child route is active', () => {
      render(
        <NavLinks
          items={nestedItems}
          pathname="/products/electronics"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
    });

    it('should render correct paths for nested items', () => {
      render(
        <NavLinks
          items={nestedItems}
          pathname="/products"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.getByTestId('link-/products')).toHaveAttribute('href', '/products');
      expect(screen.getByTestId('link-/products/electronics')).toHaveAttribute(
        'href',
        '/products/electronics'
      );
      expect(screen.getByTestId('link-/products/clothing')).toHaveAttribute(
        'href',
        '/products/clothing'
      );
    });

    it('should handle deeply nested items', () => {
      const deeplyNested: NavItem[] = [
        {
          path: 'level1',
          title: 'Level 1',
          children: [
            {
              path: 'level2',
              title: 'Level 2',
              children: [
                { path: 'level3', title: 'Level 3' },
              ],
            },
          ],
        },
      ];

      render(
        <NavLinks
          items={deeplyNested}
          pathname="/level1/level2/level3"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 2')).toBeInTheDocument();
      expect(screen.getByText('Level 3')).toBeInTheDocument();
      expect(screen.getByTestId('link-/level1/level2/level3')).toHaveAttribute(
        'href',
        '/level1/level2/level3'
      );
    });
  });

  describe('onClick Handler', () => {
    it('should call onClick when nav item is clicked', () => {
      const items: NavItem[] = [{ path: 'home', title: 'Home' }];

      render(
        <NavLinks
          items={items}
          pathname="/home"
          LinkComponent={MockLinkComponent}
          onClick={mockOnClick}
        />
      );

      fireEvent.click(screen.getByText('Home'));
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should call onClick for nested items', () => {
      const items: NavItem[] = [
        {
          path: 'products',
          title: 'Products',
          children: [{ path: 'electronics', title: 'Electronics' }],
        },
      ];

      render(
        <NavLinks
          items={items}
          pathname="/products"
          LinkComponent={MockLinkComponent}
          onClick={mockOnClick}
        />
      );

      fireEvent.click(screen.getByText('Electronics'));
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe('Indent Prop', () => {
    const nestedItems: NavItem[] = [
      {
        path: 'products',
        title: 'Products',
        children: [{ path: 'electronics', title: 'Electronics' }],
      },
    ];

    it('should apply default indent of 20px', () => {
      const { container } = render(
        <NavLinks
          items={nestedItems}
          pathname="/products"
          LinkComponent={MockLinkComponent}
        />
      );

      const indentedDiv = container.querySelector('[style*="margin-left"]');
      expect(indentedDiv).toHaveStyle('margin-left: 20px');
    });

    it('should apply custom indent value', () => {
      const { container } = render(
        <NavLinks
          items={nestedItems}
          pathname="/products"
          LinkComponent={MockLinkComponent}
          indent={40}
        />
      );

      const indentedDiv = container.querySelector('[style*="margin-left"]');
      expect(indentedDiv).toHaveStyle('margin-left: 40px');
    });

    it('should apply zero indent', () => {
      const { container } = render(
        <NavLinks
          items={nestedItems}
          pathname="/products"
          LinkComponent={MockLinkComponent}
          indent={0}
        />
      );

      const indentedDiv = container.querySelector('[style*="margin-left"]');
      expect(indentedDiv).toHaveStyle('margin-left: 0px');
    });
  });

  describe('Breadcrumb Rendering', () => {
    const items: NavItem[] = [
      {
        path: 'products',
        title: 'Products',
        children: [
          {
            path: 'electronics',
            title: 'Electronics',
            children: [{ path: 'phones', title: 'Phones' }],
          },
        ],
      },
    ];

    it('should call renderBreadcrumb with correct trail for exact match', () => {
      const mockRenderBreadcrumb = jest.fn(() => <div>Breadcrumb</div>);

      render(
        <NavLinks
          items={items}
          pathname="/products"
          LinkComponent={MockLinkComponent}
          renderBreadcrumb={mockRenderBreadcrumb}
        />
      );

      expect(mockRenderBreadcrumb).toHaveBeenCalledWith([
        { path: '/products', title: 'Products' },
      ]);
    });

    it('should call renderBreadcrumb with full trail for nested exact match', () => {
      const mockRenderBreadcrumb = jest.fn(() => <div>Breadcrumb</div>);

      render(
        <NavLinks
          items={items}
          pathname="/products/electronics"
          LinkComponent={MockLinkComponent}
          renderBreadcrumb={mockRenderBreadcrumb}
        />
      );

      expect(mockRenderBreadcrumb).toHaveBeenCalledWith([
        { path: '/products', title: 'Products' },
        { path: '/products/electronics', title: 'Electronics' },
      ]);
    });

    it('should call renderBreadcrumb with deeply nested trail', () => {
      const mockRenderBreadcrumb = jest.fn(() => <div>Breadcrumb</div>);

      render(
        <NavLinks
          items={items}
          pathname="/products/electronics/phones"
          LinkComponent={MockLinkComponent}
          renderBreadcrumb={mockRenderBreadcrumb}
        />
      );

      expect(mockRenderBreadcrumb).toHaveBeenCalledWith([
        { path: '/products', title: 'Products' },
        { path: '/products/electronics', title: 'Electronics' },
        { path: '/products/electronics/phones', title: 'Phones' },
      ]);
    });

    it('should render breadcrumb content', () => {
      const mockRenderBreadcrumb = jest.fn(() => (
        <div data-testid="breadcrumb">Custom Breadcrumb</div>
      ));

      render(
        <NavLinks
          items={items}
          pathname="/products"
          LinkComponent={MockLinkComponent}
          renderBreadcrumb={mockRenderBreadcrumb}
        />
      );

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      expect(screen.getByText('Custom Breadcrumb')).toBeInTheDocument();
    });

    it('should not call renderBreadcrumb when not on exact path', () => {
      const mockRenderBreadcrumb = jest.fn(() => <div>Breadcrumb</div>);

      render(
        <NavLinks
          items={items}
          pathname="/products/electronics/phones/extra"
          LinkComponent={MockLinkComponent}
          renderBreadcrumb={mockRenderBreadcrumb}
        />
      );

      // Should not be called because /products/electronics/phones/extra is not an exact match
      expect(mockRenderBreadcrumb).not.toHaveBeenCalled();
    });
  });

  describe('Path Handling', () => {
    it('should handle paths with leading slashes', () => {
      const items: NavItem[] = [{ path: '/home', title: 'Home' }];

      render(
        <NavLinks
          items={items}
          pathname="/home"
          LinkComponent={MockLinkComponent}
        />
      );

      // Should normalize double slashes
      expect(screen.getByTestId('link-/home')).toBeInTheDocument();
    });

    it('should handle paths without leading slashes', () => {
      const items: NavItem[] = [{ path: 'home', title: 'Home' }];

      render(
        <NavLinks
          items={items}
          pathname="/home"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.getByTestId('link-/home')).toBeInTheDocument();
    });

    it('should handle empty items array', () => {
      const { container } = render(
        <NavLinks
          items={[]}
          pathname="/home"
          LinkComponent={MockLinkComponent}
        />
      );

      // Empty fragment renders no DOM nodes
      expect(container.childNodes.length).toBe(0);
    });
  });

  describe('Active State Detection', () => {
    const items: NavItem[] = [
      {
        path: 'products',
        title: 'Products',
        children: [{ path: 'electronics', title: 'Electronics' }],
      },
      { path: 'about', title: 'About' },
    ];

    it('should detect exact match as active', () => {
      render(
        <NavLinks
          items={items}
          pathname="/products"
          LinkComponent={MockLinkComponent}
        />
      );

      // Children should be visible when parent is active
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    it('should detect child path as making parent active', () => {
      render(
        <NavLinks
          items={items}
          pathname="/products/electronics"
          LinkComponent={MockLinkComponent}
        />
      );

      // Children should be visible when child route is active
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    it('should not show children for non-active parent', () => {
      render(
        <NavLinks
          items={items}
          pathname="/about"
          LinkComponent={MockLinkComponent}
        />
      );

      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });

    it('should handle root pathname', () => {
      render(
        <NavLinks
          items={items}
          pathname="/"
          LinkComponent={MockLinkComponent}
        />
      );

      // No children should be visible at root
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });
  });

  describe('Component Export', () => {
    it('should export NavLinks as named export', () => {
      expect(NavLinks).toBeDefined();
    });

    it('should have correct function signature', () => {
      expect(typeof NavLinks).toBe('function');
      expect(NavLinks.length).toBe(1); // Takes props object
    });
  });
});
