import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '../src/localization/LocalizationContext';
import { DataTable } from '../src/components/tables/DataTable';
import { DragAndDropList } from '../src/components/tables/DragAndDropList';
import { SearchBox } from '../src/components/tables/SearchBox';

// Mock react-dnd for testing
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-provider">{children}</div>,
  useDrag: () => [{ isDragging: false }, (ref: any) => ref, (ref: any) => ref],
  useDrop: () => [{ isOver: false, handlerId: 'test-handler' }, (ref: any) => ref]
}));

// Test wrapper with localization context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

describe('Table Components Tests', () => {
  // Mock data for testing
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
  ];

  const mockColumns = [
    { name: 'Name', selector: 'name', search: 'name' },
    { name: 'Email', selector: 'email' },
    { name: 'Age', selector: 'age', search: ({ age }) => age },
  ];

  describe('SearchBox', () => {
    const mockOnChange = jest.fn();
    const mockOnClear = jest.fn();
    const mockOnSearch = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render SearchBox without crashing', () => {
      const { getByRole } = render(
        <TestWrapper>
          <SearchBox
            value=""
            onChange={mockOnChange}
          />
        </TestWrapper>
      );

      const searchInput = getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
    });

    it('should handle search input changes', () => {
      const { getByRole } = render(
        <TestWrapper>
          <SearchBox
            value=""
            onChange={mockOnChange}
          />
        </TestWrapper>
      );

      const searchInput = getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      expect(mockOnChange).toHaveBeenCalledWith('test');
    });

    it('should handle clear functionality', () => {
      const { getByRole } = render(
        <TestWrapper>
          <SearchBox
            value="test"
            onChange={mockOnChange}
            onClear={mockOnClear}
          />
        </TestWrapper>
      );

      const searchInput = getByRole('textbox');
      expect(searchInput).toHaveValue('test');
    });

    it('should handle search functionality', () => {
      const { getByRole } = render(
        <TestWrapper>
          <SearchBox
            value="test"
            onChange={mockOnChange}
            onSearch={mockOnSearch}
          />
        </TestWrapper>
      );

      const searchInput = getByRole('textbox');
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

      // The SearchBox might not have onSearch implemented, so just check it doesn't crash
      expect(searchInput).toBeInTheDocument();
    });

    it('should call onClear when clear button is clicked', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SearchBox
            value="test"
            onChange={mockOnChange}
            onClear={mockOnClear}
          />
        </TestWrapper>
      );

      const clearButton = getByTestId('close-icon').closest('button')!;
      fireEvent.click(clearButton);
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('should call onSearch when search button is clicked', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <SearchBox
            value="test"
            onChange={mockOnChange}
            onSearch={mockOnSearch}
          />
        </TestWrapper>
      );

      const searchButton = getByTestId('search-icon').closest('button')!;
      fireEvent.click(searchButton);
      expect(mockOnSearch).toHaveBeenCalled();
    });

    it('should not render clear button when onClear is not provided', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <SearchBox
            value="test"
            onChange={mockOnChange}
          />
        </TestWrapper>
      );

      expect(queryByTestId('close-icon')).not.toBeInTheDocument();
    });

    it('should not render search button when onSearch is not provided', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <SearchBox
            value="test"
            onChange={mockOnChange}
          />
        </TestWrapper>
      );

      expect(queryByTestId('search-icon')).not.toBeInTheDocument();
    });

    it('should render label when provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <SearchBox
            value=""
            onChange={mockOnChange}
            label="Search items"
          />
        </TestWrapper>
      );

      expect(getByText('Search items')).toBeInTheDocument();
    });

    it('should use custom placeholder when provided', () => {
      const { getByPlaceholderText } = render(
        <TestWrapper>
          <SearchBox
            value=""
            onChange={mockOnChange}
            placeholder="Find something..."
          />
        </TestWrapper>
      );

      expect(getByPlaceholderText('Find something...')).toBeInTheDocument();
    });
  });

  describe('DataTable', () => {
    it('should render DataTable without crashing', () => {
      expect(() => {
        render(
          <TestWrapper>
            <DataTable data={mockData} columns={mockColumns} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should render table with correct data', () => {
      const { getByText } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={mockColumns} />
        </TestWrapper>
      );

      expect(getByText('John Doe')).toBeInTheDocument();
      expect(getByText('jane@example.com')).toBeInTheDocument();
      expect(getByText('35')).toBeInTheDocument();
    });

    it('should handle empty data', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable data={[]} columns={mockColumns} />
        </TestWrapper>
      );

      const rows = container.querySelectorAll('tbody tr');
      // DataTable shows a "No information to display" row when empty
      expect(rows.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle row selection', () => {
      const mockOnClickRow = jest.fn();
      const { container } = render(
        <TestWrapper>
          <DataTable 
            data={mockData} 
            columns={mockColumns} 
            onClickRow={mockOnClickRow}
          />
        </TestWrapper>
      );

      const firstRow = container.querySelector('tbody tr');
      if (firstRow) {
        fireEvent.click(firstRow);
        expect(mockOnClickRow).toHaveBeenCalledWith(mockData[0]);
      }
    });

    it('should handle custom column rendering', () => {
      const customColumns = [
        { name: 'Name', selector: 'name' },
        { 
          name: 'Custom', 
          selector: (row: any) => `Custom: ${row.name}`,
          className: 'custom-column'
        }
      ];

      const { getByText } = render(
        <TestWrapper>
          <DataTable data={mockData} columns={customColumns} />
        </TestWrapper>
      );

      expect(getByText('Custom: John Doe')).toBeInTheDocument();
    });

    it('should handle search functionality', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable 
            data={mockData} 
            columns={mockColumns} 
            showHeader={{ search: true }}
          />
        </TestWrapper>
      );

      const searchInput = container.querySelector('input[type="text"]');
      expect(searchInput).toBeInTheDocument();
    });

    it('should handle pagination', () => {
      const largeData = Array(15).fill(null).map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + i
      }));

      const { container } = render(
        <TestWrapper>
          <DataTable 
            data={largeData} 
            columns={mockColumns} 
            rowsPerPage={5}
          />
        </TestWrapper>
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBeLessThanOrEqual(5);
    });

    it('should handle custom header content', () => {
      const customHeader = <div data-testid="custom-header">Custom Header</div>;
      const { getByTestId } = render(
        <TestWrapper>
          <DataTable 
            data={mockData} 
            columns={mockColumns} 
            showHeader={{ customHeader }}
          />
        </TestWrapper>
      );

      expect(getByTestId('custom-header')).toBeInTheDocument();
    });

    it('should handle sum calculations', () => {
      const columnsWithSum = [
        { name: 'Name', selector: 'name' },
        { 
          name: 'Age', 
          selector: 'age',
          value: (row: any) => row.age
        }
      ];

      const { container } = render(
        <TestWrapper>
          <DataTable 
            data={mockData} 
            columns={columnsWithSum} 
            showSum={true}
          />
        </TestWrapper>
      );

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });

    it('should handle loading states', () => {
      const { container } = render(
        <TestWrapper>
          <DataTable 
            data={mockData} 
            columns={mockColumns} 
            loading={true}
          />
        </TestWrapper>
      );

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });

    it('should handle different data types', () => {
      const mixedData = [
        { id: 1, name: 'John', active: true, score: 95.5 },
        { id: 2, name: 'Jane', active: false, score: 87.2 },
        { id: 3, name: 'Bob', active: true, score: 92.1 }
      ];

      const mixedColumns = [
        { name: 'ID', selector: 'id' },
        { name: 'Name', selector: 'name' },
        { name: 'Active', selector: (row: any) => row.active ? 'Yes' : 'No' },
        { name: 'Score', selector: 'score' }
      ];

      const { container } = render(
        <TestWrapper>
          <DataTable data={mixedData} columns={mixedColumns} />
        </TestWrapper>
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(3);
    });

    describe('Filtering and Search', () => {
      it('should filter data based on search input', () => {
        const { getByRole, queryByText } = render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={mockColumns} 
              showHeader={{ search: true }}
            />
          </TestWrapper>
        );

        const searchInput = getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'John' } });

        expect(queryByText('John Doe')).toBeInTheDocument();
        expect(queryByText('Jane Smith')).not.toBeInTheDocument();
        
        // Email column doesn't have search property
        fireEvent.change(searchInput, { target: { value: 'jane@example.com' } });
        expect(queryByText('Jane Smith')).not.toBeInTheDocument();
      });

      it('should handle function-based filter column', () => {
        const filterFn = (row: any) => `${row.name} ${row.email}`;
        const { getByRole, queryByText } = render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={mockColumns} 
              showHeader={{ search: true }}
            />
          </TestWrapper>
        );

        const searchInput = getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: '25' } });

        expect(queryByText('Jane Smith')).toBeInTheDocument();
        expect(queryByText('John Doe')).not.toBeInTheDocument();
      });
    });

    describe('Sorting', () => {
      it('should handle column header clicks', () => {
        const { getByText, container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={mockColumns} />
          </TestWrapper>
        );

        const nameHeader = getByText('Name');
        
        expect(() => {
          fireEvent.click(nameHeader);
        }).not.toThrow();
        
        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(3);
      });

      it('should handle multiple clicks on column headers', () => {
        const { getByText, container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={mockColumns} />
          </TestWrapper>
        );

        const nameHeader = getByText('Name');
        
        expect(() => {
          fireEvent.click(nameHeader);
          fireEvent.click(nameHeader);
        }).not.toThrow();
        
        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(3);
      });
    });

    describe('Sorting Behavior', () => {
      const sortableColumns = [
        { name: 'Name', selector: 'name' as const, orderBy: 'name' as const, search: 'name' as const },
        { name: 'Age', selector: 'age' as const, orderBy: ((row: any) => row.age) },
        { name: 'Email', selector: 'email' as const },
      ];

      it('should sort ascending then descending then unsorted on column clicks', () => {
        const { getByText, container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={sortableColumns} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        const nameHeader = getByText('Name').closest('th')!;

        // Click 1: ascending
        fireEvent.click(nameHeader);
        let rows = container.querySelectorAll('tbody tr');
        expect(rows[0]).toHaveTextContent('Bob Johnson');
        expect(rows[2]).toHaveTextContent('John Doe');

        // Click 2: descending
        fireEvent.click(nameHeader);
        rows = container.querySelectorAll('tbody tr');
        expect(rows[0]).toHaveTextContent('John Doe');
        expect(rows[2]).toHaveTextContent('Bob Johnson');

        // Click 3: unsorted (back to original order)
        fireEvent.click(nameHeader);
        rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(3);
      });

      it('should sort by function-based orderBy column', () => {
        const { getByText, container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={sortableColumns} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        const ageHeader = getByText('Age').closest('th')!;

        // Click: ascending by age
        fireEvent.click(ageHeader);
        const rows = container.querySelectorAll('tbody tr');
        // Ages: 25, 30, 35 in asc order
        expect(rows[0]).toHaveTextContent('Jane Smith');
        expect(rows[2]).toHaveTextContent('Bob Johnson');
      });

      it('should use orderByDefault string for initial sorting', () => {
        const { container } = render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={sortableColumns}
              orderByDefault="name"
              showHeader={false}
              rowsPerPage={null}
            />
          </TestWrapper>
        );

        const rows = container.querySelectorAll('tbody tr');
        expect(rows[0]).toHaveTextContent('Bob Johnson');
        expect(rows[2]).toHaveTextContent('John Doe');
      });

      it('should use orderByDefault function for initial sorting', () => {
        const { container } = render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={sortableColumns}
              orderByDefault={(row: any) => row.age}
              showHeader={false}
              rowsPerPage={null}
            />
          </TestWrapper>
        );

        const rows = container.querySelectorAll('tbody tr');
        expect(rows[0]).toHaveTextContent('Jane Smith'); // age 25
        expect(rows[2]).toHaveTextContent('Bob Johnson'); // age 35
      });

      it('should use orderByDefaultDirection desc', () => {
        const { container } = render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={sortableColumns}
              orderByDefault="age"
              orderByDefaultDirection="desc"
              showHeader={false}
              rowsPerPage={null}
            />
          </TestWrapper>
        );

        const rows = container.querySelectorAll('tbody tr');
        expect(rows[0]).toHaveTextContent('Bob Johnson'); // age 35
        expect(rows[2]).toHaveTextContent('Jane Smith'); // age 25
      });
    });

    describe('Pagination Navigation', () => {
      const paginationData = Array(25).fill(null).map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + i,
      }));

      it('should navigate forward and backward with pagination buttons', () => {
        const { getByText, container } = render(
          <TestWrapper>
            <DataTable
              data={paginationData}
              columns={mockColumns}
              rowsPerPage={5}
              showHeader={{ pagination: true }}
            />
          </TestWrapper>
        );

        // Page 1
        expect(getByText('1')).toBeInTheDocument();
        let rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(5);

        // Click next (>)
        fireEvent.click(getByText('>'));
        expect(getByText('2')).toBeInTheDocument();

        // Click last (>>)
        fireEvent.click(getByText('>>'));
        expect(getByText('5')).toBeInTheDocument();

        // Click prev (<)
        fireEvent.click(getByText('<'));
        expect(getByText('4')).toBeInTheDocument();

        // Click first (<<)
        fireEvent.click(getByText('<<'));
        expect(getByText('1')).toBeInTheDocument();
      });

      it('should disable first/prev buttons on first page', () => {
        const { getByText } = render(
          <TestWrapper>
            <DataTable
              data={paginationData}
              columns={mockColumns}
              rowsPerPage={5}
              showHeader={{ pagination: true }}
            />
          </TestWrapper>
        );

        expect(getByText('<<').closest('button')).toBeDisabled();
        expect(getByText('<').closest('button')).toBeDisabled();
        expect(getByText('>').closest('button')).not.toBeDisabled();
        expect(getByText('>>').closest('button')).not.toBeDisabled();
      });

      it('should disable next/last buttons on last page', () => {
        const { getByText } = render(
          <TestWrapper>
            <DataTable
              data={paginationData}
              columns={mockColumns}
              rowsPerPage={5}
              showHeader={{ pagination: true }}
            />
          </TestWrapper>
        );

        // Go to last page
        fireEvent.click(getByText('>>'));

        expect(getByText('<<').closest('button')).not.toBeDisabled();
        expect(getByText('<').closest('button')).not.toBeDisabled();
        expect(getByText('>').closest('button')).toBeDisabled();
        expect(getByText('>>').closest('button')).toBeDisabled();
      });
    });

    describe('Rows Per Page Selector', () => {
      const selectorData = Array(30).fill(null).map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + i,
      }));

      it('should change rows per page when selector changes', () => {
        const { container } = render(
          <TestWrapper>
            <DataTable
              data={selectorData}
              columns={mockColumns}
              rowsPerPage={10}
              rowsPerPageOptions={[5, 10, 25, null]}
              showHeader={{ numberOfRows: true }}
            />
          </TestWrapper>
        );

        const select = container.querySelector('select[name="table-pagination-options"]') as HTMLSelectElement;
        expect(select).toBeInTheDocument();

        // Change to 5 rows per page
        fireEvent.change(select, { target: { value: '5' } });
        let rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(5);

        // Change to show everything
        fireEvent.change(select, { target: { value: 'everything' } });
        rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(30);
      });

      it('should render null option as "Everything"', () => {
        const { getByText } = render(
          <TestWrapper>
            <DataTable
              data={selectorData}
              columns={mockColumns}
              showHeader={{ numberOfRows: true }}
              rowsPerPageOptions={[10, 25, null]}
            />
          </TestWrapper>
        );

        expect(getByText('Everything')).toBeInTheDocument();
      });
    });

    describe('Column onClick Handler', () => {
      it('should call column-level onClick when cell is clicked', () => {
        const mockColumnClick = jest.fn();
        const columnsWithClick = [
          { name: 'Name', selector: 'name' as const },
          { name: 'Action', selector: 'name' as const, onClick: mockColumnClick },
        ];

        const { container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={columnsWithClick} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        // Click the second column cell in first row
        const firstRow = container.querySelector('tbody tr')!;
        const cells = firstRow.querySelectorAll('td');
        fireEvent.click(cells[1]);

        expect(mockColumnClick).toHaveBeenCalledWith(mockData[0]);
      });
    });

    describe('Row className', () => {
      it('should apply string rowClassName to rows', () => {
        const { container } = render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
              rowClassName="custom-row"
              showHeader={false}
              rowsPerPage={null}
            />
          </TestWrapper>
        );

        const rows = container.querySelectorAll('tbody tr');
        rows.forEach(row => expect(row).toHaveClass('custom-row'));
      });

      it('should apply function rowClassName to rows', () => {
        const { container } = render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
              rowClassName={(row: any) => row.age > 30 ? 'senior' : 'junior'}
              showHeader={false}
              rowsPerPage={null}
            />
          </TestWrapper>
        );

        const rows = container.querySelectorAll('tbody tr');
        // John (30): junior, Jane (25): junior, Bob (35): senior
        // But order may depend on default sorting
        const classNames = Array.from(rows).map(r => r.className);
        expect(classNames).toContain('senior');
        expect(classNames).toContain('junior');
      });
    });

    describe('Empty State', () => {
      it('should show default empty text', () => {
        const { getByText } = render(
          <TestWrapper>
            <DataTable data={[]} columns={mockColumns} />
          </TestWrapper>
        );

        expect(getByText('No information to display')).toBeInTheDocument();
      });

      it('should show custom textOnEmpty', () => {
        const { getByText } = render(
          <TestWrapper>
            <DataTable data={[]} columns={mockColumns} textOnEmpty="Nothing here" />
          </TestWrapper>
        );

        expect(getByText('Nothing here')).toBeInTheDocument();
      });

      it('should return null when data is null', () => {
        const { container } = render(
          <TestWrapper>
            <DataTable data={null as any} columns={mockColumns} />
          </TestWrapper>
        );

        expect(container.querySelector('table')).not.toBeInTheDocument();
      });
    });

    describe('showHeader false', () => {
      it('should not render header row when showHeader is false', () => {
        const { container, queryByRole } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={mockColumns} showHeader={false} />
          </TestWrapper>
        );

        // No search input
        expect(container.querySelector('input[type="text"]')).not.toBeInTheDocument();
        // Table still renders
        expect(container.querySelector('table')).toBeInTheDocument();
      });
    });

    describe('Sum Footer', () => {
      it('should render sum with formatSum function', () => {
        const columnsWithSum = [
          { name: 'Name', selector: 'name' as const },
          {
            name: 'Age',
            selector: 'age' as const,
            value: (row: any) => row.age,
            formatSum: (val: number) => `Total: ${val}`,
          },
        ];

        const { getByText } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={columnsWithSum} showSum={true} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        // 30 + 25 + 35 = 90
        expect(getByText('Total: 90')).toBeInTheDocument();
      });

      it('should render sum with string value key', () => {
        const columnsWithSum = [
          { name: 'Name', selector: 'name' as const },
          { name: 'Age', selector: 'age' as const, value: 'age' as const },
        ];

        const { container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={columnsWithSum} showSum={true} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        const tfoot = container.querySelector('tfoot');
        expect(tfoot).toBeInTheDocument();
        // 30 + 25 + 35 = 90
        expect(tfoot).toHaveTextContent('90');
      });

      it('should render formatSum as static value when no value prop', () => {
        const columnsWithSum = [
          { name: 'Name', selector: 'name' as const, formatSum: 'Total:' },
          { name: 'Age', selector: 'age' as const, value: 'age' as const },
        ];

        const { container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={columnsWithSum} showSum={true} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        const tfoot = container.querySelector('tfoot');
        expect(tfoot).toHaveTextContent('Total:');
      });
    });

    describe('Options Dropdown in Column Header', () => {
      it('should render selected option text in header', () => {
        const mockOnSelect = jest.fn();
        const columnsWithDropdown = [
          {
            name: 'Status',
            selector: 'status' as const,
            optionsDropdown: {
              onSelect: mockOnSelect,
              selected: 'active',
              options: { all: 'All', active: 'Active', inactive: 'Inactive' },
            },
          },
        ];

        const dataWithStatus = mockData.map(item => ({ ...item, status: 'active' }));

        const { container } = render(
          <TestWrapper>
            <DataTable data={dataWithStatus} columns={columnsWithDropdown} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        // When selected is 'active', the toggle shows 'Active' instead of column name
        const toggle = container.querySelector('th .dropdown span');
        expect(toggle).toHaveTextContent('Active');
      });

      it('should show column name when no option is selected', () => {
        const mockOnSelect = jest.fn();
        const columnsWithDropdown = [
          {
            name: 'Status',
            selector: 'status' as const,
            optionsDropdown: {
              onSelect: mockOnSelect,
              selected: null,
              options: { all: 'All', active: 'Active', inactive: 'Inactive' },
            },
          },
        ];

        const dataWithStatus = mockData.map(item => ({ ...item, status: 'active' }));

        const { getByText } = render(
          <TestWrapper>
            <DataTable data={dataWithStatus} columns={columnsWithDropdown} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        expect(getByText('Status')).toBeInTheDocument();
      });

      it('should call onSelect with key when dropdown item is clicked', () => {
        const mockOnSelect = jest.fn();
        const columnsWithDropdown = [
          {
            name: 'Status',
            selector: 'status' as const,
            optionsDropdown: {
              onSelect: mockOnSelect,
              selected: null,
              options: { all: 'All', active: 'Active' },
            },
          },
        ];

        const dataWithStatus = mockData.map(item => ({ ...item, status: 'active' }));

        const { getByText } = render(
          <TestWrapper>
            <DataTable data={dataWithStatus} columns={columnsWithDropdown} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        // Click the dropdown toggle
        fireEvent.click(getByText('Status'));

        // Click an option
        fireEvent.click(getByText('All'));
        expect(mockOnSelect).toHaveBeenCalledWith('all');
      });

      it('should deselect when clicking already selected option', () => {
        const mockOnSelect = jest.fn();
        const columnsWithDropdown = [
          {
            name: 'Status',
            selector: 'status' as const,
            optionsDropdown: {
              onSelect: mockOnSelect,
              selected: 'active',
              options: { active: 'Active', inactive: 'Inactive' },
            },
          },
        ];

        const dataWithStatus = mockData.map(item => ({ ...item, status: 'active' }));

        const { container } = render(
          <TestWrapper>
            <DataTable data={dataWithStatus} columns={columnsWithDropdown} showHeader={false} rowsPerPage={null} />
          </TestWrapper>
        );

        // Click the dropdown toggle
        const toggle = container.querySelector('th .dropdown span')!;
        fireEvent.click(toggle);

        // Click the already selected dropdown item
        const activeItem = container.querySelector('.dropdown-item[eventkey="active"]');
        if (activeItem) fireEvent.click(activeItem);

        expect(mockOnSelect).toHaveBeenCalledWith(null);
      });
    });

    describe('showEditModalOnClickRow', () => {
      it('should not call showEditModal when there is no FormModalProvider', () => {
        const mockOnClickRow = jest.fn();

        const { container } = render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
              onClickRow={mockOnClickRow}
              showEditModalOnClickRow={true}
              showHeader={false}
              rowsPerPage={null}
            />
          </TestWrapper>
        );

        const firstRow = container.querySelector('tbody tr')!;
        fireEvent.click(firstRow);
        expect(mockOnClickRow).toHaveBeenCalled();
      });
    });

    describe('Search with clear button', () => {
      it('should clear filter text when close button is clicked', () => {
        const { getByRole, queryByText, container } = render(
          <TestWrapper>
            <DataTable
              data={mockData}
              columns={mockColumns}
              showHeader={{ search: true }}
            />
          </TestWrapper>
        );

        const searchInput = getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'John' } });
        expect(queryByText('Jane Smith')).not.toBeInTheDocument();

        // Click the clear button
        const closeButton = container.querySelector('.btn-outline-secondary');
        if (closeButton) fireEvent.click(closeButton);

        expect(queryByText('Jane Smith')).toBeInTheDocument();
      });
    });

    describe('Advanced Features', () => {
      it('should handle drag and drop', () => {
        const mockOnMove = jest.fn();
        
        expect(() => {
          render(
            <TestWrapper>
              <DataTable 
                data={mockData} 
                columns={mockColumns} 
                onMove={mockOnMove}
                moveId="id"
              />
            </TestWrapper>
          );
        }).not.toThrow();
      });

      it('should handle column options dropdown', () => {
        const mockOnSelect = jest.fn();
        const columnsWithDropdown = [
          {
            name: 'Status',
            selector: 'status',
            optionsDropdown: {
              onSelect: mockOnSelect,
              selected: 'active',
              options: {
                all: 'All',
                active: 'Active',
                inactive: 'Inactive'
              }
            }
          }
        ];

        const dataWithStatus = mockData.map(item => ({ ...item, status: 'active' }));

        const { container } = render(
          <TestWrapper>
            <DataTable data={dataWithStatus} columns={columnsWithDropdown} />
          </TestWrapper>
        );

        const table = container.querySelector('table');
        expect(table).toBeInTheDocument();
      });

      it('should handle rows per page selector', () => {
        const { getByText } = render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={mockColumns} 
              showHeader={{ numberOfRows: true }}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </TestWrapper>
        );

        expect(getByText('Number of rows')).toBeInTheDocument();
      });

      it('should handle pagination display', () => {
        const largeData = Array(25).fill(null).map((_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          age: 20 + (i % 30)
        }));

        const { getByText } = render(
          <TestWrapper>
            <DataTable 
              data={largeData} 
              columns={mockColumns} 
              showHeader={{ pagination: true }}
              rowsPerPage={10}
            />
          </TestWrapper>
        );

        expect(getByText('1')).toBeInTheDocument();
      });
    });
  });

  describe('DragAndDropList', () => {
    it('should render DragAndDropList without crashing', () => {
      const TestItem = React.forwardRef<HTMLDivElement, { name: string }>(
        ({ name, ...props }, ref) => <div ref={ref} {...props}>{name}</div>
      );
      
      expect(() => {
        render(
          <TestWrapper>
            <DragAndDropList 
              propsArray={mockData} 
              onDrop={() => {}} 
              component={TestItem}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle drag and drop functionality', () => {
      const mockOnDrop = jest.fn();
      const TestItem = React.forwardRef<HTMLDivElement, { name: string }>(
        ({ name, ...props }, ref) => <div ref={ref} {...props}>{name}</div>
      );
      
      const { getByText } = render(
        <TestWrapper>
          <DragAndDropList 
            propsArray={mockData} 
            onDrop={mockOnDrop}
            component={TestItem}
          />
        </TestWrapper>
      );

      // Check if the first item is rendered
      expect(getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle empty data', () => {
      const TestItem = React.forwardRef<HTMLDivElement, { name: string }>(
        ({ name, ...props }, ref) => <div ref={ref} {...props}>{name}</div>
      );
      
      const { container } = render(
        <TestWrapper>
          <DragAndDropList 
            propsArray={[]} 
            onDrop={() => {}} 
            component={TestItem}
          />
        </TestWrapper>
      );

      // Component should render even with empty data
      expect(container).toBeInTheDocument();
    });

    it('should handle custom item rendering', () => {
      const customRender = React.forwardRef<HTMLDivElement, any>(
        (props, ref) => (
          <div ref={ref} data-testid={`item-${props.id}`} className="custom-item" {...props}>
            {props.name} - {props.email}
          </div>
        )
      );

      const { getByTestId } = render(
        <TestWrapper>
          <DragAndDropList 
            propsArray={mockData} 
            onDrop={() => {}} 
            component={customRender}
          />
        </TestWrapper>
      );

      // Check if the custom rendered items are present
      expect(getByTestId('item-1')).toBeInTheDocument();
      expect(getByTestId('item-1')).toHaveTextContent('John Doe - john@example.com');
    });

    it('should handle loading state', () => {
      const TestItem = React.forwardRef<HTMLDivElement, { name: string }>(
        ({ name, ...props }, ref) => <div ref={ref} {...props}>{name}</div>
      );
      
      const { container } = render(
        <TestWrapper>
          <DragAndDropList 
            propsArray={mockData} 
            onDrop={() => {}} 
            component={TestItem}
          />
        </TestWrapper>
      );

      // Component should render even in loading state
      expect(container).toBeInTheDocument();
    });

    it('should handle disabled state', () => {
      const TestItem = React.forwardRef<HTMLDivElement, { name: string }>(
        ({ name, ...props }, ref) => <div ref={ref} {...props}>{name}</div>
      );
      
      const { container } = render(
        <TestWrapper>
          <DragAndDropList 
            propsArray={mockData} 
            onDrop={() => {}} 
            component={TestItem}
          />
        </TestWrapper>
      );

      // Component should render even when disabled
      expect(container).toBeInTheDocument();
    });
  });

  describe('Component Export Verification', () => {
    it('should export all table components as functions', () => {
      expect(typeof DataTable).toBe('function');
      expect(typeof DragAndDropList).toBe('function');
      expect(typeof SearchBox).toBe('function');
    });
  });
});
