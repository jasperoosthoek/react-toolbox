// Comprehensive DataTable examples showcasing all features

import React, { useState } from 'react';
import { Badge, Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { 
  DataTable, 
  FormProvider, 
  FormModal,
  EditButton, 
  FormModalProvider,
  FormEditModalButton,
  FormCreateModalButton,
  DeleteConfirmButton
} from '../../index';
import {
  mockUsers,
  mockProducts,
  mockOrders,
  User,
  Product,
  Order,
  getStatusBadge,
  formatCurrency,
  formatDate,
  mockDataFormatter,
  userInterfaceExample,
  productInterfaceExample,
  orderInterfaceExample,
  formatCurrencyExample,
  formatDateExample,
} from '../data/mockData';
import { FixedLoadingIndicator } from './FixedLoadingIndicator';
import { ExampleSection } from './ExampleSection';

const getStatusBadgeExample = `const getStatusBadge = (status: string) => {
  const statusClasses = {
    active: 'badge bg-success',
    inactive: 'badge bg-secondary',
    pending: 'badge bg-warning',
    delivered: 'badge bg-success',
    shipped: 'badge bg-info',
    processing: 'badge bg-warning',
  };
  return statusClasses[status as keyof typeof statusClasses] || 'badge bg-secondary';
};`

// Example 1: Basic DataTable with sorting
const BasicDataTableExampleComponent = () => {
  const columns = [
    { name: 'ID', orderBy: 'id', selector: 'id', search: 'id' },
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email', search: 'email' },
    { name: 'Department', orderBy: 'department', selector: 'department', search: 'department' },
    {
      name: 'Status',
      orderBy: 'status',
      selector: (user: User) => (
        <Badge className={getStatusBadge(user.status)}>
          {user.status}
        </Badge>
      ),
      search: ({ status }: User) => status,
    },
  ];

  return (
    <div>
      <DataTable
        data={mockUsers}
        columns={columns}
        orderByDefault="name"
        orderByDefaultDirection="asc"
      />
    </div>
  );
};

export const BasicDataTableExample = () => {
  const code = `import React from 'react';
import { Badge } from 'react-bootstrap';
import { DataTable } from '@jasperoosthoek/react-toolbox';

const BasicDataTableExample = () => {
  const columns = [
    { name: 'ID', orderBy: 'id', selector: 'id', search: 'id' },
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email', search: 'email' },
    { name: 'Department', orderBy: 'department', selector: 'department', search: 'department' },
    { 
      name: 'Status', 
      orderBy: 'status', 
      selector: (user: User) => (
        <Badge className={getStatusBadge(user.status)}>
          {user.status}
        </Badge>
      ),
      search: ({ status }: User) => status,
    },
  ];

  return (
    <DataTable
      data={mockUsers}
      columns={columns}
      orderByDefault="name"
      orderByDefaultDirection="asc"
    />
  );
};

export default BasicDataTableExample;

// Types and Mock Data
${userInterfaceExample}

const mockUsers: User[] = ${mockDataFormatter(mockUsers)};

// Helper function
${getStatusBadgeExample}`;

  return (
    <ExampleSection
      title="Basic DataTable with Sorting"
      description="Simple table with column sorting functionality. Click column headers to sort data."
      code={code}
      features={['Column Sorting', 'Custom Renderers', 'Badge Components', 'Default Ordering', 'Search Support']}
      notes={[
        'Click any column header to sort ascending/descending',
        'Custom selector functions allow for complex rendering',
        'Status column demonstrates Badge component integration',
        'Default sorting can be set with orderByDefault prop',
        'Search property enables column-specific searching'
      ]}
    >
      <BasicDataTableExampleComponent />
    </ExampleSection>
  );
};

// Example 2: DataTable with pagination and search
const PaginatedDataTableExampleComponent = () => {
  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name', formatSum: 'Total' },
    { name: 'Email', orderBy: 'email', selector: 'email', search: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role', search: 'role' },
    {
      name: 'Salary',
      orderBy: 'salary',
      selector: (user: User) => formatCurrency(user.salary),
      search: ({ salary }: User) => salary,
      value: 'salary',
      formatSum: formatCurrency,
    },
    { name: 'Join Date', orderBy: 'joinDate', selector: (user: User) => formatDate(user.joinDate), search: ({ joinDate }: User) => joinDate},
  ];

  return (
    <DataTable
      data={mockUsers}
      columns={columns}
      rowsPerPageOptions={[5, 10, 25, null]}
      rowsPerPage={5}
      showSum
    />
  );
};

export const PaginatedDataTableExample = () => {
  const code = `import React from 'react';
import { DataTable } from '@jasperoosthoek/react-toolbox';
 
const PaginatedDataTableExample = () => {
  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name', formatSum: 'Total' },
    { name: 'Email', orderBy: 'email', selector: 'email', search: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role', search: 'role' },
    {
      name: 'Salary',
      orderBy: 'salary',
      selector: (user: User) => formatCurrency(user.salary),
      search: ({ salary }: User) => salary,
      value: 'salary',
      formatSum: formatCurrency,
    },
    { 
      name: 'Join Date', 
      orderBy: 'joinDate', 
      selector: (user: User) => formatDate(user.joinDate),
      search: ({ joinDate }: User) => joinDate,
    },
  ];

  return (
    <DataTable
      data={mockUsers}
      columns={columns}
      rowsPerPageOptions={[5, 10, 25, null]}
      rowsPerPage={5}
      showSum
    />
  );
};

export default PaginatedDataTableExample;

// Types and Mock Data
${userInterfaceExample}

const mockUsers: User[] = ${mockDataFormatter(mockUsers)};

// Helper functions
${formatCurrencyExample}

${formatDateExample}`;

  return (
    <ExampleSection
      title="DataTable with Pagination"
      description="Table with built-in pagination controls and customizable page sizes plus sum calculations."
      code={code}
      features={['Pagination', 'Page Size Options', 'Data Formatting', 'Large Dataset Handling', 'Sum Calculations']}
      notes={[
        'rowsPerPageOptions allows users to choose page size',
        'null in options array means "Show All" option',
        'Custom formatters (formatCurrency, formatDate) improve readability',
        'Pagination automatically handles large datasets efficiently',
        'showSum enables totals row with formatSum for custom formatting',
        'value property specifies which field to sum for numeric columns'
      ]}
    >
      <PaginatedDataTableExampleComponent />
    </ExampleSection>
  );
};

// Example 3: DataTable with row click to edit
const EditableDataTableExampleComponent = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email', search: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role', search: 'role' },
    {
      name: 'Status',
      orderBy: 'status',
      selector: (user: User) => (
        <Badge className={getStatusBadge(user.status)}>
          {user.status}
        </Badge>
      ),
      search: ({ status }: User) => status,
    },
    { name: 'Actions', className: 'text-center', selector: (user: User) => (
      <ButtonGroup size="sm">
        <EditButton onClick={() => handleRowClick(user)} />
        <DeleteConfirmButton 
          onDelete={() => handleDelete(user.id)}
          size="sm"
        />
      </ButtonGroup>
    ) },
  ];

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEditSubmit = (data: any, callback?: () => void) => {
    setUsers(users.map(user => 
      user.id === selectedUser?.id 
        ? { ...user, ...data }
        : user
    ));
    
    setTimeout(() => {
      setShowModal(false);
      setSelectedUser(null);
      if (callback) callback();
    }, 1000);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const formFields = {
    name: {
      label: 'Name',
      required: true,
      initialValue: selectedUser?.name || '',
    },
    email: {
      label: 'Email',
      required: true,
      initialValue: selectedUser?.email || '',
    },
    role: {
      label: 'Role',
      required: true,
      initialValue: selectedUser?.role || '',
    },
    status: {
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
      ],
      initialValue: selectedUser?.status || 'active',
    },
  };

  return (
    <div>
      <DataTable
        data={users}
        columns={columns}
        onClickRow={handleRowClick}
        rowClassName="table-row-hover"
      />

      {showModal && selectedUser && (
        <FormProvider
          formFields={formFields}
          onSubmit={handleEditSubmit}
          resetTrigger={selectedUser.id}
        >
          <FormModal
            show={showModal}
            onHide={() => setShowModal(false)}
            modalTitle={`Edit ${selectedUser.name}`}
            submitText="Save Changes"
            cancelText="Cancel"
          />
        </FormProvider>
      )}
    </div>
  );
};

export const EditableDataTableExample = () => {
  const code = `import React, { useState } from 'react';
import { Badge, ButtonGroup } from 'react-bootstrap';
import { 
  DataTable, 
  FormProvider, 
  FormModal,
  EditButton,
  DeleteConfirmButton
} from '@jasperoosthoek/react-toolbox';

const EditableDataTableExample = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email', search: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role', search: 'role' },
    { 
      name: 'Status', 
      orderBy: 'status', 
      selector: (user: User) => (
        <Badge className={getStatusBadge(user.status)}>
          {user.status}
        </Badge>
      ),
      search: ({ status }: User) => status,
    },
    { 
      name: 'Actions', 
      className: 'text-center', 
      selector: (user: User) => (
        <ButtonGroup size="sm">
          <EditButton onClick={() => handleRowClick(user)} />
          <DeleteConfirmButton 
            onDelete={() => handleDelete(user.id)}
            size="sm"
          />
        </ButtonGroup>
      ) 
    },
  ];

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEditSubmit = (data: any, callback?: () => void) => {
    setUsers(users.map(user => 
      user.id === selectedUser?.id 
        ? { ...user, ...data }
        : user
    ));
    
    setTimeout(() => {
      setShowModal(false);
      setSelectedUser(null);
      if (callback) callback();
    }, 1000);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const formFields = {
    name: {
      label: 'Name',
      required: true,
      initialValue: selectedUser?.name || '',
    },
    email: {
      label: 'Email',
      required: true,
      initialValue: selectedUser?.email || '',
    },
    role: {
      label: 'Role',
      required: true,
      initialValue: selectedUser?.role || '',
    },
    status: {
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
      ],
      initialValue: selectedUser?.status || 'active',
    },
  };

  return (
    <div>
      <DataTable
        data={users}
        columns={columns}
        onClickRow={handleRowClick}
        rowClassName="table-row-hover"
      />

      {showModal && selectedUser && (
        <FormProvider
          formFields={formFields}
          onSubmit={handleEditSubmit}
          resetTrigger={selectedUser.id}
        >
          <FormModal
            show={showModal}
            onHide={() => setShowModal(false)}
            modalTitle={\`Edit \${selectedUser.name}\`}
            submitText="Save Changes"
            cancelText="Cancel"
          />
        </FormProvider>
      )}
    </div>
  );
};

export default EditableDataTableExample;

// Types and Mock Data
${userInterfaceExample}

const mockUsers: User[] = ${mockDataFormatter(mockUsers)};

// Helper function
${getStatusBadgeExample}`;

  return (
    <ExampleSection
      title="Editable DataTable"
      description="Interactive table with row click to edit functionality and action buttons."
      code={code}
      features={['Row Click Editing', 'Modal Forms', 'Action Buttons', 'Delete Confirmation', 'Real-time Updates']}
      notes={[
        'Click any row to open edit modal with current data',
        'Action buttons provide alternative interaction method',
        'DeleteConfirmButton includes built-in confirmation dialog',
        'Form state automatically resets when editing different users',
        'Changes are immediately reflected in the table'
      ]}
    >
      <EditableDataTableExampleComponent />
    </ExampleSection>
  );
};

// Example 4: DataTable with drag and drop reordering
const DragDropDataTableExampleComponent = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isMoving, setIsMoving] = useState(false);

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name', formatSum: 'Total' },
    { name: 'Category', orderBy: 'category', selector: 'category', search: 'category' },
    {
      name: 'Price',
      orderBy: 'price',
      selector: (product: Product) => formatCurrency(product.price),
      search: 'product',
      value: 'price',
      formatSum: formatCurrency,
    },
    {
      name: 'Stock',
      orderBy: 'stock',
      selector: (product: Product) => (
        <Badge bg={product.stock > 50 ? 'success' : product.stock > 20 ? 'warning' : 'danger'}>
          {product.stock}
        </Badge>
      ),
      search: 'stock',
    },
    {
      name: 'Tags',
      selector: (product: Product) => (
        <span>
          {product.tags.map((tag, index) => (
            <Badge key={index} bg="secondary" className="me-1">
              {tag}
            </Badge>
          ))}
        </span>
      ),
      search: ({ tags }) => tags.join(' '),
    },
  ];

  const handleMove = ({ item, target, reset }: { item: Product; target: Product; reset: () => void }) => {
    setIsMoving(true);
    
    // Get current positions
    const currentData = [...products];
    const itemIndex = currentData.findIndex(p => p.id === item.id);
    const targetIndex = currentData.findIndex(p => p.id === target.id);
    
    // Remove item from current position
    const [movedItem] = currentData.splice(itemIndex, 1);
    // Insert at new position
    currentData.splice(targetIndex, 0, movedItem);
    
    // Update state immediately (optimistic update)
    setProducts(currentData);
    
    // Simulate API call to save new order
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        console.log('Move saved successfully!');
        setIsMoving(false);
      } else {
        console.log('Move failed! Resetting...');
        reset(); // Reset to original position
        setIsMoving(false);
      }
    }, 1500);
  };

  return (
    <div>
      <FixedLoadingIndicator 
        show={isMoving}
        message="Saving new order..."
        variant="info"
      />
      
      <DataTable
        data={products}
        columns={columns}
        onMove={handleMove}
        moveIsLoading={isMoving}
        showSum
      />
    </div>
  );
};

export const DragDropDataTableExample = () => {
  const code = `import React, { useState } from 'react';
import { Badge, Alert } from 'react-bootstrap';
import { DataTable } from '@jasperoosthoek/react-toolbox';

const DragDropDataTableExample = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isMoving, setIsMoving] = useState(false);

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name', formatSum: 'Total' },
    { name: 'Category', orderBy: 'category', selector: 'category', search: 'category' },
    {
      name: 'Price',
      orderBy: 'price',
      selector: (product: Product) => formatCurrency(product.price),
      search: ({ price }: Product) => price,
      value: 'price',
      formatSum: formatCurrency,
    },
    { 
      name: 'Stock', 
      orderBy: 'stock', 
      selector: (product: Product) => (
        <Badge bg={product.stock > 50 ? 'success' : product.stock > 20 ? 'warning' : 'danger'}>
          {product.stock}
        </Badge>
      ),
      search: ({ stock }: Product) => stock,
    },
    { 
      name: 'Tags', 
      selector: (product: Product) => (
        <span>
          {product.tags.map((tag, index) => (
            <Badge key={index} bg="secondary" className="me-1">
              {tag}
            </Badge>
          ))}
        </span>
      ),
      search: ({ tags }: Product) => tags.join(' '),
    },
  ];
  const handleMove = ({ item, target, reset }: { item: Product; target: Product; reset: () => void }) => {
    setIsMoving(true);
    
    // Get current positions
    const currentData = [...products];
    const itemIndex = currentData.findIndex(p => p.id === item.id);
    const targetIndex = currentData.findIndex(p => p.id === target.id);
    
    // Remove item from current position
    const [movedItem] = currentData.splice(itemIndex, 1);
    // Insert at new position
    currentData.splice(targetIndex, 0, movedItem);
    
    // Update state immediately (optimistic update)
    setProducts(currentData);
    
    // Simulate API call to save new order
    setTimeout(() => {
      const success = Math.random() > 0.2;
      
      if (success) {
        setIsMoving(false);
      } else {
        reset(); // Reset to original position on failure
        setIsMoving(false);
      }
    }, 1500);
  };

  return (
    <div>
      {isMoving && (
        <Alert variant="info" className="mb-3">
          Saving new order...
        </Alert>
      )}
      
      <DataTable
        data={products}
        columns={columns}
        onMove={handleMove}
        moveIsLoading={isMoving}
        showSum
      />
    </div>
  );
};

export default DragDropDataTableExample;

// Types and Mock Data
${productInterfaceExample}

const mockProducts: Product[] = ${mockDataFormatter(mockProducts)};

// Helper function
${formatCurrencyExample}`;

  return (
    <ExampleSection
      title="DataTable with Drag & Drop Reordering"
      description="Drag rows to reorder them with server persistence and error handling plus sum calculations."
      code={code}
      features={['Drag & Drop', 'Optimistic Updates', 'Error Handling', 'Loading States', 'Stock Status Badges', 'Sum Calculations']}
      notes={[
        'Drag any row to reorder - changes are immediately visible',
        'Optimistic updates provide instant feedback to users',
        'If server save fails, the row automatically resets to original position',
        'Loading indicator shows during save operation',
        'Stock levels are color-coded: green (50+), yellow (20-49), red (<20)',
        'showSum displays totals with custom formatting for price column'
      ]}
    >
      <DragDropDataTableExampleComponent />
    </ExampleSection>
  );
};

// Example 5: DataTable with custom cell renderers and actions
const CustomRendererDataTableExampleComponent = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const statusOptions = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus as Order['status'] }
        : order
    ));
  };

  const columns = [
    { name: 'Order ID', orderBy: 'id', selector: (order: Order) => `#${order.id}`, search: 'id', formatSum: 'Total' },
    { name: 'Customer', orderBy: 'customerName', selector: 'customerName', search: 'customerName' },
    { name: 'Product', orderBy: 'product', selector: 'product', search: 'product' },
    { name: 'Quantity',
      orderBy: 'quantity',
      selector: 'quantity',
      search: 'quantity',
      value: 'quantity',
    },
    {
      name: 'Total',
      orderBy: 'total',
      selector: (order: Order) => formatCurrency(order.total),
      search: ({ total }: Order) => total,
      value: 'total',
      formatSum: total => formatCurrency(total),
    },
    { 
      name: 'Status', 
      orderBy: 'status',
      selector: (order: Order) => (
        <Dropdown>
          <Dropdown.Toggle 
            variant="outline-secondary" 
            size="sm"
            className={getStatusBadge(order.status)}
          >
            {order.status}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'pending')}>
              Pending
            </Dropdown.Item>
            <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'processing')}>
              Processing
            </Dropdown.Item>
            <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'shipped')}>
              Shipped
            </Dropdown.Item>
            <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'delivered')}>
              Delivered
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
      search: ({ status }: Order) => status,
      optionsDropdown: {
        onSelect: (key: string | null) => {
          console.log('Filter by status:', key);
        },
        selected: null,
        options: statusOptions,
      }
    },
    { name: 'Actions', className: 'text-center', selector: (order: Order) => (
      <ButtonGroup size="sm">
        <Button variant="outline-primary" size="sm">
          View
        </Button>
        <Button variant="outline-secondary" size="sm">
          Print
        </Button>
      </ButtonGroup>
    ) },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      rowsPerPageOptions={[5, 10, 25, null]}
      rowsPerPage={5}
      showSum
    />
  );
};

export const CustomRendererDataTableExample = () => {
  const code = `import React, { useState } from 'react';
import { Badge, Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { DataTable } from '@jasperoosthoek/react-toolbox';

const CustomRendererDataTableExample = () => {
  const [orders, setOrders] = useState(mockOrders);

  const statusOptions = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus as Order['status'] }
        : order
    ));
  };

  const columns = [
    { 
      name: 'Order ID', 
      orderBy: 'id', 
      selector: (order: Order) => \`#\${order.id}\`,
      search: 'id',
      formatSum: 'Total'
    },
    { name: 'Customer', orderBy: 'customerName', selector: 'customerName', search: 'customerName' },
    { name: 'Product', orderBy: 'product', selector: 'product', search: 'product' },
    { 
      name: 'Quantity', 
      orderBy: 'quantity', 
      selector: 'quantity',
      search: 'quantity',
      value: 'quantity',
    },
    { 
      name: 'Total', 
      orderBy: 'total', 
      selector: (order: Order) => formatCurrency(order.total),
      search: ({ total }: Order) => total,
      value: 'total',
      formatSum: formatCurrency,
    },
    { 
      name: 'Status', 
      orderBy: 'status',
      selector: (order: Order) => (
        <Dropdown>
          <Dropdown.Toggle 
            variant="outline-secondary" 
            size="sm"
            className={getStatusBadge(order.status)}
          >
            {order.status}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'pending')}>
              Pending
            </Dropdown.Item>
            <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'processing')}>
              Processing
            </Dropdown.Item>
            <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'shipped')}>
              Shipped
            </Dropdown.Item>
            <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'delivered')}>
              Delivered
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
      search: ({ status }: Order) => status,
      optionsDropdown: {
        onSelect: (key: string | null) => {
          console.log('Filter by status:', key);
        },
        selected: null,
        options: statusOptions,
      }
    },
    { 
      name: 'Actions', 
      className: 'text-center', 
      selector: (order: Order) => (
        <ButtonGroup size="sm">
          <Button variant="outline-primary" size="sm">
            View
          </Button>
          <Button variant="outline-secondary" size="sm">
            Print
          </Button>
        </ButtonGroup>
      ) 
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      rowsPerPageOptions={[5, 10, 25, null]}
      rowsPerPage={5}
      showSum
    />
  );
};

export default CustomRendererDataTableExample;

// Types and Mock Data
${orderInterfaceExample}

const mockOrders: Order[] = ${mockDataFormatter(mockOrders)};

// Helper functions
${getStatusBadgeExample}

${formatCurrencyExample}`;

  return (
    <ExampleSection
      title="DataTable with Custom Renderers"
      description="Advanced rendering with dropdown status updates, action buttons, column filters, and sum calculations."
      code={code}
      features={['Custom Cell Renderers', 'Interactive Dropdowns', 'Status Updates', 'Action Buttons', 'Column Filters', 'Sum Calculations']}
      notes={[
        'Status column uses interactive dropdown for real-time updates',
        'Order ID column adds # prefix for better visual formatting',
        'Action buttons provide contextual operations for each row',
        'optionsDropdown enables column-specific filtering',
        'Multiple custom renderers can be combined in a single table',
        'showSum displays totals for quantity and total columns with custom formatting'
      ]}
    >
      <CustomRendererDataTableExampleComponent />
    </ExampleSection>
  );
};

// Example 6: DataTable with FormModalProvider integration
const IntegratedFormDataTableExampleComponent = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const formFields = {
    name: {
      label: 'Full Name',
      required: true,
      initialValue: '',
    },
    email: {
      label: 'Email',
      required: true,
      initialValue: '',
    },
    role: {
      label: 'Role',
      required: true,
      initialValue: '',
    },
    department: {
      label: 'Department',
      type: 'select' as const,
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Design', label: 'Design' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Finance', label: 'Finance' },
        { value: 'HR', label: 'HR' },
      ],
      initialValue: '',
    },
    status: {
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
      ],
      initialValue: 'active',
    },
  };

  const handleCreate = (data: any, callback?: () => void) => {
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...data,
      joinDate: new Date().toISOString().split('T')[0],
      salary: 70000, // Default salary
    };
    
    setUsers([...users, newUser]);
    
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const handleUpdate = (data: any, callback?: () => void) => {
    setUsers(users.map(user =>
      user.id === data.id ? { ...user, ...data } : user
    ));
    
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email', search: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role', search: 'role' },
    { name: 'Department', orderBy: 'department', selector: 'department', search: 'department' },
    {
      name: 'Status',
      orderBy: 'status',
      selector: (user: User) => (
        <Badge className={getStatusBadge(user.status)}>
          {user.status}
        </Badge>
      ),
      search: ({ status }: User) => status,
    },
    { name: 'Actions', className: 'text-center', selector: (user: User) => (
      <ButtonGroup size="sm">
        <FormEditModalButton state={user} variant="outline-primary" size="sm" />
        <DeleteConfirmButton 
          onDelete={() => handleDelete(user.id)}
          variant="outline-primary"
          size="sm"
        />
      </ButtonGroup>
    ) },
  ];

  return (
    <FormModalProvider
      formFields={formFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      createModalTitle="Add New Employee"
      editModalTitle="Edit Employee"
    >
      <div>
        <div className="d-flex justify-content-between mb-3">
          <h5>Employee Management</h5>
          <FormCreateModalButton variant="primary">
            Add Employee
          </FormCreateModalButton>
        </div>
        
        <DataTable
          data={users}
          columns={columns}
          rowsPerPageOptions={[5, 10, 25, null]}
          rowsPerPage={5}
        />
      </div>
    </FormModalProvider>
  );
};

export const IntegratedFormDataTableExample = () => {
  const code = `import React, { useState } from 'react';
import { Badge, ButtonGroup } from 'react-bootstrap';
import { 
  DataTable,
  FormModalProvider,
  FormCreateModalButton,
  FormEditModalButton,
  DeleteConfirmButton
} from '@jasperoosthoek/react-toolbox';

const IntegratedFormDataTableExample = () => {
  const [users, setUsers] = useState(mockUsers);

  const formFields = {
    name: {
      label: 'Full Name',
      required: true,
      initialValue: '',
    },
    email: {
      label: 'Email',
      required: true,
      initialValue: '',
    },
    role: {
      label: 'Role',
      required: true,
      initialValue: '',
    },
    department: {
      label: 'Department',
      type: 'select' as const,
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Design', label: 'Design' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Finance', label: 'Finance' },
        { value: 'HR', label: 'HR' },
      ],
      initialValue: '',
    },
    status: {
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
      ],
      initialValue: 'active',
    },
  };

  const handleCreate = (data: any, callback?: () => void) => {
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...data,
      joinDate: new Date().toISOString().split('T')[0],
      salary: 70000, // Default salary
    };
    
    setUsers([...users, newUser]);
    
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const handleUpdate = (data: any, callback?: () => void) => {
    setUsers(users.map(user =>
      user.id === data.id ? { ...user, ...data } : user
    ));
    
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name', search: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email', search: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role', search: 'role' },
    { name: 'Department', orderBy: 'department', selector: 'department', search: 'department' },
    { 
      name: 'Status', 
      orderBy: 'status', 
      selector: (user: User) => (
        <Badge className={getStatusBadge(user.status)}>
          {user.status}
        </Badge>
      ),
      search: ({ status }: User) => status, 
    },
    { name: 'Actions', className: 'text-center', selector: (user: User) => (
      <ButtonGroup size="sm">
        <FormEditModalButton state={user} variant="outline-primary" size="sm" />
        <DeleteConfirmButton 
          onDelete={() => handleDelete(user.id)}
          variant="outline-primary"
          size="sm"
        />
      </ButtonGroup>
    ) },
  ];

  return (
    <FormModalProvider
      formFields={formFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      createModalTitle="Add New Employee"
      editModalTitle="Edit Employee"
    >
      <div>
        <div className="d-flex justify-content-between mb-3">
          <h5>Employee Management</h5>
          <FormCreateModalButton variant="primary">
            Add Employee
          </FormCreateModalButton>
        </div>
        
        <DataTable
          data={users}
          columns={columns}
          rowsPerPageOptions={[5, 10, 25, null]}
          rowsPerPage={5}
        />
      </div>
    </FormModalProvider>
  );
};

export default IntegratedFormDataTableExample;

// Types and Mock Data
${userInterfaceExample}

const mockUsers: User[] = ${mockDataFormatter(mockUsers)};

// Helper function
${getStatusBadgeExample}`;

  return (
    <ExampleSection
      title="DataTable with FormModalProvider Integration"
      description="Complete CRUD operations with seamless form modal integration for create and edit operations."
      code={code}
      features={['Full CRUD Operations', 'Modal Forms', 'Create/Edit Integration', 'Form Validation', 'Button Integration']}
      notes={[
        'FormModalProvider handles all form state and modal management',
        'FormCreateModalButton automatically opens create modal with empty form',
        'FormEditModalButton automatically populates form with selected row data',
        'DeleteConfirmButton provides built-in confirmation with customizable messages',
        'All operations include loading states and error handling',
        'Perfect pattern for admin panels and data management interfaces',
        'Copy-paste ready: includes all types, mock data, and helper functions needed'
      ]}
    >
      <IntegratedFormDataTableExampleComponent />
    </ExampleSection>
  );
};
