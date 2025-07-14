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

        const searchInput = getByRole('textbox');
        expect(searchInput).toBeInTheDocument();
      });

      it('should show rows per page selector when enabled', () => {
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

      it('should show pagination when enabled', () => {
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

        expect(getByText('1')).toBeInTheDocument(); // Page number
      });

      it('should display custom header content', () => {
        const customHeader = <div data-testid="custom-header">Custom Header Content</div>;
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
    });

    describe('Filtering and Search', () => {
      it('should filter data based on search input', () => {
        const { getByRole, queryByText } = render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={mockColumns} 
              showHeader={{ search: true }}
              filterColumn="name"
            />
          </TestWrapper>
        );

        const searchInput = getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'John' } });

        expect(queryByText('John Doe')).toBeInTheDocument();
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
              filterColumn={filterFn}
            />
          </TestWrapper>
        );

        const searchInput = getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'jane@example' } });

        expect(queryByText('Jane Smith')).toBeInTheDocument();
        expect(queryByText('John Doe')).not.toBeInTheDocument();
      });

      it('should handle multiple filter columns', () => {
        const { getByRole, queryByText } = render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={mockColumns} 
              showHeader={{ search: true }}
              filterColumn={['name', 'email']}
            />
          </TestWrapper>
        );

        const searchInput = getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'bob' } });

        expect(queryByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    describe('Sorting', () => {
      it('should sort data when column header is clicked', () => {
        const { getByText, container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={mockColumns} />
          </TestWrapper>
        );

        const nameHeader = getByText('Name');
        fireEvent.click(nameHeader);

        // Check if data is sorted (Bob should come first alphabetically)
        const rows = container.querySelectorAll('tbody tr');
        expect(rows[0]).toHaveTextContent('Bob Johnson');
      });

      it('should reverse sort on second click', () => {
        const { getByText, container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={mockColumns} />
          </TestWrapper>
        );

        const nameHeader = getByText('Name');
        fireEvent.click(nameHeader); // First click - ascending
        fireEvent.click(nameHeader); // Second click - descending

        const rows = container.querySelectorAll('tbody tr');
        expect(rows[0]).toHaveTextContent('John Doe'); // Should be last alphabetically
      });

      it('should handle function-based orderBy', () => {
        const { getByText, container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={mockColumns} />
          </TestWrapper>
        );

        const ageHeader = getByText('Age');
        fireEvent.click(ageHeader);

        const rows = container.querySelectorAll('tbody tr');
        expect(rows[0]).toHaveTextContent('25'); // Jane, youngest
      });

      it('should apply default sorting', () => {
        const { container } = render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={mockColumns} 
              orderByDefault="age"
              orderByDefaultDirection="desc"
            />
          </TestWrapper>
        );

        const rows = container.querySelectorAll('tbody tr');
        expect(rows[0]).toHaveTextContent('35'); // Bob, oldest
      });
    });

    describe('Pagination', () => {
      const largeData = Array(25).fill(null).map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + (i % 30)
      }));

      it('should paginate data when rowsPerPage is set', () => {
        const { container, queryByText } = render(
          <TestWrapper>
            <DataTable 
              data={largeData} 
              columns={mockColumns} 
              rowsPerPage={10}
            />
          </TestWrapper>
        );

        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(10);
        expect(queryByText('User 11')).not.toBeInTheDocument();
      });

      it('should change rows per page when selector is used', () => {
        const { getByDisplayValue, container } = render(
          <TestWrapper>
            <DataTable 
              data={largeData} 
              columns={mockColumns} 
              rowsPerPage={10}
              rowsPerPageOptions={[5, 10, 20]}
              showHeader={{ numberOfRows: true }}
            />
          </TestWrapper>
        );

        const selector = getByDisplayValue('10');
        fireEvent.change(selector, { target: { value: '5' } });

        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(5);
      });

      it('should handle null in rowsPerPageOptions for "All"', () => {
        const { getByText, container } = render(
          <TestWrapper>
            <DataTable 
              data={largeData} 
              columns={mockColumns} 
              rowsPerPage={10}
              rowsPerPageOptions={[5, 10, null]}
              showHeader={{ numberOfRows: true }}
            />
          </TestWrapper>
        );

        const allOption = getByText('Everything');
        expect(allOption).toBeInTheDocument();
      });
    });

    describe('Row Interactions', () => {
      it('should handle row clicks when onClickRow is provided', () => {
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
        fireEvent.click(firstRow!);

        expect(mockOnClickRow).toHaveBeenCalledWith(mockData[0]);
      });

      it('should handle column-specific clicks', () => {
        const mockColumnClick = jest.fn();
        const columnsWithClick = [
          ...mockColumns.slice(0, 2),
          {
            name: 'Actions',
            selector: () => 'Click me',
            onClick: mockColumnClick,
          },
        ];

        const { getByText } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={columnsWithClick} />
          </TestWrapper>
        );

        const clickableCell = getByText('Click me');
        fireEvent.click(clickableCell);

        expect(mockColumnClick).toHaveBeenCalled();
      });
    });

    describe('Column Features', () => {
      it('should handle options dropdown in column header', () => {
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
                inactive: 'Inactive',
              },
            },
          },
        ];

        const dataWithStatus = mockData.map(item => ({ ...item, status: 'active' }));

        const { getByText } = render(
          <TestWrapper>
            <DataTable data={dataWithStatus} columns={columnsWithDropdown} />
          </TestWrapper>
        );

        expect(getByText('Status')).toBeInTheDocument();
      });

      it('should apply custom column className', () => {
        const columnsWithClass = [
          {
            name: 'ID',
            selector: 'id',
            className: 'id-column',
          },
        ];

        const { container } = render(
          <TestWrapper>
            <DataTable data={mockData} columns={columnsWithClass} />
          </TestWrapper>
        );

        const headerCell = container.querySelector('th');
        expect(headerCell).toHaveClass('id-column');
      });

      it('should handle sum calculation for numeric columns', () => {
        const columnsWithSum = [
          {
            name: 'Age',
            selector: 'age',
            value: (row: any) => row.age,
          },
        ];

        const { getByText } = render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columnsWithSum} 
              showSum={true}
            />
          </TestWrapper>
        );

        // Sum of ages: 30 + 25 + 35 = 90
        expect(getByText('90')).toBeInTheDocument();
      });

      it('should format sum with custom formatter', () => {
        const columnsWithFormattedSum = [
          {
            name: 'Age',
            selector: 'age',
            value: (row: any) => row.age,
            formatSum: (value: number) => `Total: ${value} years`,
          },
        ];

        const { getByText } = render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columnsWithFormattedSum} 
              showSum={true}
            />
          </TestWrapper>
        );

        expect(getByText('Total: 90 years')).toBeInTheDocument();
      });
    });

    describe('Drag and Drop', () => {
      it('should handle drag and drop when onMove is provided', () => {
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

      it('should show loading state for move operation', () => {
        const mockOnMove = jest.fn();
        
        expect(() => {
          render(
            <TestWrapper>
              <DataTable 
                data={mockData} 
                columns={mockColumns} 
                onMove={mockOnMove}
                moveId="id"
                moveIsLoading={true}
              />
            </TestWrapper>
          );
        }).not.toThrow();
      });
    });

    describe('Integration with FormModal', () => {
      it('should handle showEditModalOnClickRow', () => {
        // Mock useFormModal hook
        const mockShowEditModal = jest.fn();
        jest.spyOn(require('../components/forms/FormModalProvider'), 'useFormModal')
          .mockReturnValue({
            showEditModal: mockShowEditModal,
            hasProvider: true,
            showCreateModal: jest.fn(),
          });

        const { container } = render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={mockColumns} 
              showEditModalOnClickRow={true}
            />
          </TestWrapper>
        );

        const firstRow = container.querySelector('tbody tr');
        fireEvent.click(firstRow!);

        expect(mockShowEditModal).toHaveBeenCalledWith(mockData[0]);
      });
    });
  });
});

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

    it('should render with all button combinations', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SearchBox
              value="test"
              onChange={mockOnChange}
              onClear={mockOnClear}
              onSearch={mockOnSearch}
              label="Search Label"
              placeholder="Custom placeholder"
              className="custom-class"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should be a valid React component', () => {
      expect(typeof SearchBox).toBe('function');
    });
  });

  describe('DataTable - Core Features', () => {
    const mockData = [
      { id: 1, name: 'John', age: 30, email: 'john@example.com', salary: 50000 },
      { id: 2, name: 'Jane', age: 25, email: 'jane@example.com', salary: 60000 },
      { id: 3, name: 'Bob', age: 35, email: 'bob@example.com', salary: 70000 },
    ];

    const mockOnMove = jest.fn();
    const mockOnClickRow = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be a valid React component', () => {
      expect(typeof DataTable).toBe('function');
    });

    it('should render with basic columns', () => {
      const basicColumns = [
        { name: 'ID', selector: 'id' },
        { name: 'Name', selector: 'name' },
        { name: 'Age', selector: 'age' },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable data={mockData} columns={basicColumns} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle function-based selectors', () => {
      const functionalColumns = [
        { name: 'Name', selector: (row: any) => row.name.toUpperCase() },
        { name: 'Age Group', selector: (row: any) => row.age > 30 ? 'Senior' : 'Junior' },
        { name: 'Email Domain', selector: (row: any) => row.email.split('@')[1] },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable data={mockData} columns={functionalColumns} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle sorting configuration', () => {
      const sortableColumns = [
        { name: 'Name', selector: 'name', orderBy: 'name' },
        { name: 'Age', selector: 'age', orderBy: 'age' },
        { name: 'Calculated', selector: 'salary', orderBy: (row: any) => row.salary },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={sortableColumns}
              orderByDefault="name"
              orderByDefaultDirection="desc"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle filtering options', () => {
      const columns = [
        { name: 'Name', selector: 'name' },
        { name: 'Email', selector: 'email' },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columns}
              filterColumn="name"
            />
          </TestWrapper>
        );
      }).not.toThrow();

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columns}
              filterColumn={['name', 'email']}
            />
          </TestWrapper>
        );
      }).not.toThrow();

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columns}
              filterColumn={(row: any) => `${row.name} ${row.email}`}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle pagination configurations', () => {
      const columns = [{ name: 'Name', selector: 'name' }];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columns}
              rowsPerPage={2}
              rowsPerPageOptions={[2, 5, 10, null]}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle header configurations', () => {
      const columns = [{ name: 'Name', selector: 'name' }];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columns}
              showHeader={{
                search: true,
                numberOfRows: true,
                pagination: true,
                customHeader: <button>Custom Action</button>
              }}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle drag and drop props', () => {
      const columns = [{ name: 'Name', selector: 'name' }];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columns}
              onMove={mockOnMove}
              moveId="id"
              moveIsLoading={false}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle click interactions', () => {
      const columns = [
        { 
          name: 'Name', 
          selector: 'name',
          onClick: mockOnClickRow
        },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columns}
              onClickRow={mockOnClickRow}
              showEditModalOnClickRow={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle sum calculations', () => {
      const columnsWithSums = [
        { 
          name: 'Name', 
          selector: 'name' 
        },
        { 
          name: 'Age', 
          selector: 'age',
          value: 'age',
          formatSum: (sum: number) => `Total: ${sum} years`
        },
        { 
          name: 'Salary', 
          selector: 'salary',
          value: (row: any) => row.salary,
          formatSum: (sum: number) => `$${sum.toLocaleString()}`
        },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columnsWithSums}
              showSum={true}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle styling and customization', () => {
      const columns = [{ name: 'Name', selector: 'name', className: 'name-column' }];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={mockData} 
              columns={columns}
              className="custom-table"
              style={{ border: '1px solid red' }}
              rowClassName={(row: any) => row.age > 30 ? 'senior' : 'junior'}
              textOnEmpty="No employees found"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle empty data gracefully', () => {
      const columns = [{ name: 'Name', selector: 'name' }];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={[]} 
              columns={columns}
              textOnEmpty="No data available"
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should return null for invalid data/columns', () => {
      const { container: container1 } = render(
        <TestWrapper>
          <DataTable data={null as any} columns={[]} />
        </TestWrapper>
      );

      const { container: container2 } = render(
        <TestWrapper>
          <DataTable data={[]} columns={null as any} />
        </TestWrapper>
      );

      expect(container1.firstChild).toBeNull();
      expect(container2.firstChild).toBeNull();
    });
  });

  describe('DataTable - Advanced Features', () => {
    const complexData = [
      { id: 1, name: 'John', department: 'IT', active: true, score: 85 },
      { id: 2, name: 'Jane', department: 'HR', active: false, score: 92 },
      { id: 3, name: 'Bob', department: 'IT', active: true, score: 78 },
    ];

    it('should handle complex column configurations', () => {
      const complexColumns = [
        { 
          name: 'ID', 
          selector: 'id',
          orderBy: 'id',
          className: 'id-column'
        },
        { 
          name: 'Employee', 
          selector: (row: any) => (
            <div>
              <strong>{row.name}</strong>
              <br />
              <small>{row.department}</small>
            </div>
          ),
          orderBy: 'name'
        },
        { 
          name: 'Status', 
          selector: (row: any) => row.active ? '✅ Active' : '❌ Inactive',
          orderBy: (row: any) => row.active ? 1 : 0
        },
        { 
          name: 'Score', 
          selector: 'score',
          orderBy: 'score',
          value: 'score',
          formatSum: (sum: number) => `Avg: ${(sum / complexData.length).toFixed(1)}`
        },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={complexData} 
              columns={complexColumns}
              filterColumn={['name', 'department']}
              orderByDefault={(row: any) => row.score}
              orderByDefaultDirection="desc"
              rowsPerPage={2}
              showSum={true}
              showHeader={{
                search: true,
                numberOfRows: true,
                pagination: true
              }}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should handle all prop combinations', () => {
      const allFeaturesColumns = [
        { name: 'Name', selector: 'name', orderBy: 'name' },
        { name: 'Dept', selector: 'department', orderBy: 'department' },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <DataTable 
              data={complexData}
              columns={allFeaturesColumns}
              rowsPerPage={10}
              rowsPerPageOptions={[5, 10, 25, null]}
              filterColumn={['name', 'department']}
              orderByDefault="name"
              orderByDefaultDirection="asc"
              onMove={jest.fn()}
              moveId="id"
              moveIsLoading={false}
              showHeader={{
                search: true,
                numberOfRows: true,
                pagination: true,
                customHeader: <div>Actions</div>
              }}
              onClickRow={jest.fn()}
              showEditModalOnClickRow={false}
              textOnEmpty="No records found"
              className="data-table"
              rowClassName="table-row"
              style={{ width: '100%' }}
              showSum={false}
            />
          </TestWrapper>
        );
      }).not.toThrow();
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

    it('should handle complex prop configurations', () => {
      const complexPropsArray = [
        { 
          row: { id: 1, name: 'Item 1' }, 
          className: 'item-1', 
          style: { color: 'red' },
          onClick: jest.fn(),
          'data-priority': 'high'
        },
        { 
          row: { id: 2, name: 'Item 2' }, 
          disabled: true,
          'aria-label': 'Disabled item'
        },
        { 
          row: { id: 3, name: 'Item 3' }, 
          onClick: jest.fn(),
          style: { backgroundColor: 'blue' }
        },
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

    it('should handle different component types', () => {
      const TableRowComponent = ({ row, ...props }: any) => (
        <tr {...props}>
          <td>{row.name}</td>
          <td>{row.id}</td>
        </tr>
      );

      expect(() => {
        render(
          <table>
            <tbody>
              <DragAndDropList
                onDrop={mockOnDrop}
                propsArray={mockPropsArray}
                component={TableRowComponent}
              />
            </tbody>
          </table>
        );
      }).not.toThrow();
    });

    it('should be a valid React component', () => {
      expect(typeof DragAndDropList).toBe('function');
    });

    describe('DragAndDropList Comprehensive Tests', () => {
      const mockItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];

      describe('Basic Functionality', () => {
        it('should render drag and drop list without crashing', () => {
          const mockOnMove = jest.fn();
          
          expect(() => {
            render(
              <TestWrapper>
                <DragAndDropList 
                  data={mockItems}
                  onMove={mockOnMove}
                  renderItem={(item) => <div>{item.name}</div>}
                />
              </TestWrapper>
            );
          }).not.toThrow();
        });

        it('should display all items', () => {
          const mockOnMove = jest.fn();
          const { getByText } = render(
            <TestWrapper>
              <DragAndDropList 
                data={mockItems}
                onMove={mockOnMove}
                renderItem={(item) => <div>{item.name}</div>}
              />
            </TestWrapper>
          );

          expect(getByText('Item 1')).toBeInTheDocument();
          expect(getByText('Item 2')).toBeInTheDocument();
          expect(getByText('Item 3')).toBeInTheDocument();
        });

        it('should handle empty data', () => {
          const mockOnMove = jest.fn();
          
          expect(() => {
            render(
              <TestWrapper>
                <DragAndDropList 
                  data={[]}
                  onMove={mockOnMove}
                  renderItem={(item) => <div>{item.name}</div>}
                />
              </TestWrapper>
            );
          }).not.toThrow();
        });

        it('should handle loading state', () => {
          const mockOnMove = jest.fn();
          
          expect(() => {
            render(
              <TestWrapper>
                <DragAndDropList 
                  data={mockItems}
                  onMove={mockOnMove}
                  renderItem={(item) => <div>{item.name}</div>}
                  loading={true}
                />
              </TestWrapper>
            );
          }).not.toThrow();
        });

        it('should apply custom className', () => {
          const mockOnMove = jest.fn();
          const { container } = render(
            <TestWrapper>
              <DragAndDropList 
                data={mockItems}
                onMove={mockOnMove}
                renderItem={(item) => <div>{item.name}</div>}
                className="custom-list"
              />
            </TestWrapper>
          );

          const listContainer = container.firstChild;
          expect(listContainer).toHaveClass('custom-list');
        });

        it('should handle disabled state', () => {
          const mockOnMove = jest.fn();
          
          expect(() => {
            render(
              <TestWrapper>
                <DragAndDropList 
                  data={mockItems}
                  onMove={mockOnMove}
                  renderItem={(item) => <div>{item.name}</div>}
                  disabled={true}
                />
              </TestWrapper>
            );
          }).not.toThrow();
        });
      });

      describe('Custom Rendering', () => {
        it('should use custom render function', () => {
          const mockOnMove = jest.fn();
          const customRender = (item: any) => (
            <div data-testid="custom-item">
              Custom: {item.name}
            </div>
          );

          const { getAllByTestId } = render(
            <TestWrapper>
              <DragAndDropList 
                data={mockItems}
                onMove={mockOnMove}
                renderItem={customRender}
              />
            </TestWrapper>
          );

          const customItems = getAllByTestId('custom-item');
          expect(customItems).toHaveLength(mockItems.length);
          expect(customItems[0]).toHaveTextContent('Custom: Item 1');
        });

        it('should handle complex render functions', () => {
          const mockOnMove = jest.fn();
          const complexRender = (item: any, index: number) => (
            <div data-testid={`item-${index}`} className="complex-item">
              <span>#{index + 1}</span>
              <strong>{item.name}</strong>
              <button onClick={() => console.log('clicked')}>Action</button>
            </div>
          );

          const { getByTestId } = render(
            <TestWrapper>
              <DragAndDropList 
                data={mockItems}
                onMove={mockOnMove}
                renderItem={complexRender}
              />
            </TestWrapper>
          );

          expect(getByTestId('item-0')).toBeInTheDocument();
          expect(getByTestId('item-0')).toHaveTextContent('#1');
          expect(getByTestId('item-0')).toHaveTextContent('Item 1');
        });
      });

      describe('Drag and Drop Interactions', () => {
        it('should handle drag start events', () => {
          const mockOnMove = jest.fn();
          const { container } = render(
            <TestWrapper>
              <DragAndDropList 
                data={mockItems}
                onMove={mockOnMove}
                renderItem={(item) => <div>{item.name}</div>}
              />
            </TestWrapper>
          );

          const firstItem = container.querySelector('[draggable="true"]');
          if (firstItem) {
            fireEvent.dragStart(firstItem);
            expect(firstItem).toBeInTheDocument();
          }
        });

        it('should handle drop events', () => {
          const mockOnMove = jest.fn();
          const { container } = render(
            <TestWrapper>
              <DragAndDropList 
                data={mockItems}
                onMove={mockOnMove}
                renderItem={(item) => <div>{item.name}</div>}
              />
            </TestWrapper>
          );

          const items = container.querySelectorAll('[draggable="true"]');
          if (items.length >= 2) {
            const firstItem = items[0];
            const secondItem = items[1];

            fireEvent.dragStart(firstItem);
            fireEvent.dragOver(secondItem);
            fireEvent.drop(secondItem);

            expect(mockOnMove).toHaveBeenCalled();
          }
        });
      });
    });
  });

  describe('Component Integration', () => {
    it('should work together in realistic scenarios', () => {
      const tableData = [
        { id: 1, name: 'Alice', role: 'Developer', salary: 75000 },
        { id: 2, name: 'Bob', role: 'Designer', salary: 65000 },
      ];

      const tableColumns = [
        { name: 'Name', selector: 'name', orderBy: 'name' },
        { name: 'Role', selector: 'role', orderBy: 'role' },
        { name: 'Salary', selector: (row: any) => `$${row.salary.toLocaleString()}`, orderBy: 'salary' },
      ];

      expect(() => {
        render(
          <TestWrapper>
            <div>
              <SearchBox
                value=""
                onChange={() => {}}
                onSearch={() => {}}
                label="Search Employees"
              />
              <DataTable
                data={tableData}
                columns={tableColumns}
                filterColumn={['name', 'role']}
                showHeader={true}
                onClickRow={() => {}}
              />
            </div>
          </TestWrapper>
        );
      }).not.toThrow();
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
