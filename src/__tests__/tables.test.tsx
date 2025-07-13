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
