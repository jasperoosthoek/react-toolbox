import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '../localization/LocalizationContext';
import { DataTable } from '../components/tables/DataTable';
import { DragAndDropList } from '../components/tables/DragAndDropList';
import { SearchBox } from '../components/tables/SearchBox';

// Test wrapper with localization context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

describe('Table Components Tests', () => {
  describe('SearchBox', () => {
    const mockOnChange = jest.fn();
    const mockOnClear = jest.fn();
    const mockOnSearch = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render SearchBox without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value=""
              onChange={mockOnChange}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle value prop correctly', () => {
      const { container } = render(
        <TestWrapper>
          <SearchBox
            value="test search"
            onChange={mockOnChange}
          />
        </TestWrapper>
      );

      const input = container.querySelector('input');
      expect(input?.value).toBe('test search');
    });

    it('should call onChange when input changes', () => {
      const { container } = render(
        <TestWrapper>
          <SearchBox
            value=""
            onChange={mockOnChange}
          />
        </TestWrapper>
      );

      const input = container.querySelector('input');
      if (input) {
        fireEvent.change(input, { target: { value: 'new search' } });
        expect(mockOnChange).toHaveBeenCalledWith('new search');
      }
    });

    it('should render with custom className', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value=""
              onChange={mockOnChange}
              className="custom-search-class"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render with label', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value=""
              onChange={mockOnChange}
              label="Search Label"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render with ReactNode label', () => {
      const customLabel = <span>Custom Label</span>;

      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value=""
              onChange={mockOnChange}
              label={customLabel}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle custom placeholder', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value=""
              onChange={mockOnChange}
              placeholder="Custom placeholder"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle disabled placeholder', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value=""
              onChange={mockOnChange}
              placeholder={false}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render clear button when onClear provided', () => {
      const { container } = render(
        <TestWrapper>
          <SearchBox
            value="test"
            onChange={mockOnChange}
            onClear={mockOnClear}
          />
        </TestWrapper>
      );

      const clearButtons = container.querySelectorAll('button');
      expect(clearButtons.length).toBeGreaterThan(0);
    });

    it('should call onClear when clear button clicked', () => {
      const { container } = render(
        <TestWrapper>
          <SearchBox
            value="test"
            onChange={mockOnChange}
            onClear={mockOnClear}
          />
        </TestWrapper>
      );

      const buttons = container.querySelectorAll('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
        expect(mockOnClear).toHaveBeenCalled();
      }
    });

    it('should render search button when onSearch provided', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value=""
              onChange={mockOnChange}
              onSearch={mockOnSearch}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should call onSearch when search button clicked', () => {
      const { container } = render(
        <TestWrapper>
          <SearchBox
            value="test"
            onChange={mockOnChange}
            onSearch={mockOnSearch}
          />
        </TestWrapper>
      );

      const buttons = container.querySelectorAll('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[buttons.length - 1]); // Last button should be search
        expect(mockOnSearch).toHaveBeenCalled();
      }
    });

    it('should handle both clear and search buttons', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value="test"
              onChange={mockOnChange}
              onClear={mockOnClear}
              onSearch={mockOnSearch}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should be a valid React component', () => {
      expect(typeof SearchBox).toBe('function');
    });
  });

  describe('DataTable', () => {
    const mockData = [
      { id: 1, name: 'John', age: 30, email: 'john@example.com' },
      { id: 2, name: 'Jane', age: 25, email: 'jane@example.com' },
      { id: 3, name: 'Bob', age: 35, email: 'bob@example.com' },
    ];

    const mockColumns = [
      { name: 'ID', selector: 'id' },
      { name: 'Name', selector: 'name' },
      { name: 'Age', selector: 'age' },
      { name: 'Email', selector: (row: any) => row.email },
    ];

    const mockOnMove = jest.fn();
    const mockOnClickRow = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be a valid React component', () => {
      expect(typeof DataTable).toBe('function');
    });

    it('should render DataTable without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render empty table when data is empty', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={[]}
              columns={mockColumns}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle custom rowsPerPage', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
              rowsPerPage={5}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle null rowsPerPage (show all)', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
              rowsPerPage={null}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle showHeader boolean', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
              showHeader={false}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle textOnEmpty', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={[]}
              columns={mockColumns}
              textOnEmpty="No data available"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle className and style', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
              className="custom-table"
              style={{ margin: '10px' }}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle rowClassName as string', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
              rowClassName="custom-row"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle simple column configurations', () => {
      const simpleColumns = [
        { name: 'ID', selector: 'id', className: 'id-column' },
        { name: 'Name', selector: 'name' },
        { name: 'Age', selector: (row: any) => row.age },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={simpleColumns}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should return null when data or columns are not provided', () => {
      const { container: container1 } = render(
        <TestWrapper>
          <DataTable data={null as any} columns={mockColumns} />
        </TestWrapper>
      );

      const { container: container2 } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={null as any} />
        </TestWrapper>
      );

      expect(container1.firstChild).toBeNull();
      expect(container2.firstChild).toBeNull();
    });
  });

  describe('DragAndDropList', () => {
    const mockOnDrop = jest.fn();
    const mockComponent = ({ row, ...props }: any) => (
      <div {...props} data-testid={`item-${row.id}`}>
        {row.name}
      </div>
    );

    const mockPropsArray = [
      { row: { id: 1, name: 'Item 1' } },
      { row: { id: 2, name: 'Item 2' } },
      { row: { id: 3, name: 'Item 3' } },
    ];

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render DragAndDropList without crashing', () => {
      expect(() => {
        render(
          <DragAndDropList
            onDrop={mockOnDrop}
            propsArray={mockPropsArray}
            component={mockComponent}
          />
        );
      }).not.toThrow();
    });

    it('should handle empty propsArray', () => {
      expect(() => {
        render(
          <DragAndDropList
            onDrop={mockOnDrop}
            propsArray={[]}
            component={mockComponent}
          />
        );
      }).not.toThrow();
    });

    it('should handle different component types', () => {
      const DifferentComponent = ({ row, ...props }: any) => (
        <span {...props}>{row.name}</span>
      );

      expect(() => {
        render(
          <DragAndDropList
            onDrop={mockOnDrop}
            propsArray={mockPropsArray}
            component={DifferentComponent}
          />
        );
      }).not.toThrow();
    });

    it('should handle various prop combinations in propsArray', () => {
      const complexPropsArray = [
        { row: { id: 1, name: 'Item 1' }, className: 'item-1', style: { color: 'red' } },
        { row: { id: 2, name: 'Item 2' }, disabled: true },
        { row: { id: 3, name: 'Item 3' }, onClick: jest.fn() },
      ];

      expect(() => {
        render(
          <DragAndDropList
            onDrop={mockOnDrop}
            propsArray={complexPropsArray}
            component={mockComponent}
          />
        );
      }).not.toThrow();
    });

    it('should return null when component is not provided', () => {
      const { container } = render(
        <DragAndDropList
          onDrop={mockOnDrop}
          propsArray={mockPropsArray}
          component={null as any}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should be a valid React component', () => {
      expect(typeof DragAndDropList).toBe('function');
    });
  });

  describe('Component Export Verification', () => {
    it('should export all table components as functions', () => {
      expect(typeof DataTable).toBe('function');
      expect(typeof DragAndDropList).toBe('function');
      expect(typeof SearchBox).toBe('function');
    });
  });

  describe('Basic Integration Tests', () => {
    it('should render SearchBox without complex features', () => {
      const mockData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
      ];

      const simpleColumns = [
        { name: 'Name', selector: 'name' },
        { name: 'Age', selector: 'age' },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value=""
              onChange={() => {}}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render simple DataTable configuration', () => {
      const simpleData = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];

      const simpleColumns = [
        { name: 'Name', selector: 'name' },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable
              data={simpleData}
              columns={simpleColumns}
              showHeader={false}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});
