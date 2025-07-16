// Comprehensive DataTable examples showcasing all features

import React, { useState } from 'react';
import { Badge, Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { 
  DataTable, 
  FormProvider, 
  FormModal, 
  FormInput, 
  FormSelect, 
  EditButton, 
  DeleteButton,
  CreateButton,
  SearchButton,
  FormModalProvider,
  FormEditModalButton,
  FormCreateModalButton,
  DeleteConfirmButton
} from '../index';
import { mockUsers, mockProducts, mockOrders, User, Product, Order, getStatusBadge, formatCurrency, formatDate } from './data/mockData';

// Example 1: Basic DataTable with sorting
export const BasicDataTableExample = () => {
  const columns = [
    { name: 'ID', orderBy: 'id', selector: 'id' },
    { name: 'Name', orderBy: 'name', selector: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email' },
    { name: 'Department', orderBy: 'department', selector: 'department' },
    { name: 'Status', orderBy: 'status', selector: (user: User) => (
      <Badge className={getStatusBadge(user.status)}>
        {user.status}
      </Badge>
    ) },
  ];

  const renderRow = (user: User) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.department}</td>
      <td>
        <Badge className={getStatusBadge(user.status)}>
          {user.status}
        </Badge>
      </td>
    </tr>
  );

  return (
    <div>
      <h4>Basic DataTable with Sorting</h4>
      <p>Click column headers to sort. Status and department columns demonstrate custom sorting.</p>
      <DataTable
        data={mockUsers}
        columns={columns}
        orderByDefault="name"
        orderByDefaultDirection="asc"
      />
    </div>
  );
};

// Example 2: DataTable with pagination and search
export const PaginatedDataTableExample = () => {
  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role' },
    { name: 'Salary', orderBy: 'salary', selector: (user: User) => formatCurrency(user.salary) },
    { name: 'Join Date', orderBy: 'joinDate', selector: (user: User) => formatDate(user.joinDate) },
  ];

  return (
    <div>
      <h4>DataTable with Pagination and Search</h4>
      <p>Search functionality filters across all columns. Pagination controls large datasets.</p>
      <DataTable
        data={mockUsers}
        columns={columns}
        // searchPlaceholder="Search employees..."
        rowsPerPageOptions={[5, 10, 25, null]}
        rowsPerPage={5}
      />
    </div>
  );
};

// Example 3: DataTable with row click to edit
export const EditableDataTableExample = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role' },
    { name: 'Status', orderBy: 'status', selector: (user: User) => (
      <Badge className={getStatusBadge(user.status)}>
        {user.status}
      </Badge>
    ) },
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
    console.log('Editing user:', data);
    // Update user in the list
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
    console.log('Deleting user:', userId);
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

  const renderRow = (user: User) => (
    <tr key={user.id} onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <Badge className={getStatusBadge(user.status)}>
          {user.status}
        </Badge>
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        <ButtonGroup size="sm">
          <EditButton onClick={() => handleRowClick(user)} />
          <DeleteConfirmButton 
            onDelete={() => handleDelete(user.id)}
            size="sm"
          />
        </ButtonGroup>
      </td>
    </tr>
  );

  return (
    <div>
      <h4>Editable DataTable</h4>
      <p>Click any row to edit, or use the action buttons. Delete confirmation is built-in.</p>
      
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

// Example 4: DataTable with drag and drop reordering
export const DragDropDataTableExample = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isMoving, setIsMoving] = useState(false);

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name' },
    { name: 'Category', orderBy: 'category', selector: 'category' },
    { name: 'Price', orderBy: 'price', selector: (product: Product) => formatCurrency(product.price) },
    { name: 'Stock', orderBy: 'stock', selector: (product: Product) => (
      <Badge bg={product.stock > 50 ? 'success' : product.stock > 20 ? 'warning' : 'danger'}>
        {product.stock}
      </Badge>
    ) },
    { name: 'Tags', selector: (product: Product) => (
      <span>
        {product.tags.map((tag, index) => (
          <Badge key={index} bg="secondary" className="me-1">
            {tag}
          </Badge>
        ))}
      </span>
    ) },
  ];

  const handleMove = ({ item, target, reset }: { item: Product; target: Product; reset: () => void }) => {
    setIsMoving(true);
    console.log('Moving item:', item.name, 'to position of:', target.name);
    
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
      <h4>DataTable with Drag & Drop Reordering</h4>
      <p>Drag rows to reorder them. The order is saved to the server with error handling.</p>
      
      {/* Fixed position loading indicator that doesn't affect layout */}
      {isMoving && (
        <div 
          className="alert alert-info" 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1050,
            minWidth: '250px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Saving new order...
          </div>
        </div>
      )}
      
      <DataTable
        data={products}
        columns={columns}
        onMove={handleMove}
        moveIsLoading={isMoving}
      />
    </div>
  );
};

// Example 5: DataTable with custom cell renderers and actions
export const CustomRendererDataTableExample = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const statusOptions = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
  };

  const columns = [
    { name: 'Order ID', orderBy: 'id', selector: (order: Order) => `#${order.id}` },
    { name: 'Customer', orderBy: 'customerName', selector: 'customerName' },
    { name: 'Product', orderBy: 'product', selector: 'product' },
    { name: 'Quantity', orderBy: 'quantity', selector: 'quantity' },
    { name: 'Total', orderBy: 'total', selector: (order: Order) => formatCurrency(order.total) },
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

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus as Order['status'] }
        : order
    ));
  };

  return (
    <div>
      <h4>DataTable with Custom Renderers</h4>
      <p>Custom status dropdown, action buttons, and column filters demonstrate advanced rendering.</p>
      
      <DataTable
        data={orders}
        columns={columns}
        // searchPlaceholder="Search orders..."
        rowsPerPageOptions={[5, 10, 25, null]}
        rowsPerPage={5}
      />
    </div>
  );
};

// Example 6: DataTable with FormModalProvider integration
export const IntegratedFormDataTableExample = () => {
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
    console.log('Created user:', newUser);
    
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const handleUpdate = (data: any, callback?: () => void) => {
    setUsers(users.map(user =>
      user.id === data.id ? { ...user, ...data } : user
    ));
    console.log('Updated user:', data);
    
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role' },
    { name: 'Department', orderBy: 'department', selector: 'department' },
    { name: 'Status', orderBy: 'status', selector: (user: User) => (
      <Badge className={getStatusBadge(user.status)}>
        {user.status}
      </Badge>
    ) },
    { name: 'Actions', className: 'text-center', selector: (user: User) => (
      <ButtonGroup size="sm">
        <FormEditModalButton state={user}>
          <EditButton />
        </FormEditModalButton>
        <DeleteConfirmButton 
          onDelete={() => handleDelete(user.id)}
          size="sm"
        />
      </ButtonGroup>
    ) },
  ];

  const renderRow = (user: User) => (
    <tr key={user.id}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>{user.department}</td>
      <td>
        <Badge className={getStatusBadge(user.status)}>
          {user.status}
        </Badge>
      </td>
      <td>
        <ButtonGroup size="sm">
          <FormEditModalButton state={user} />
          <DeleteConfirmButton 
            onDelete={() => handleDelete(user.id)}
            size="sm"
          />
        </ButtonGroup>
      </td>
    </tr>
  );

  return (
    <FormModalProvider
      formFields={formFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      createModalTitle="Add New Employee"
      editModalTitle="Edit Employee"
    >
      <div>
        <h4>DataTable with FormModalProvider Integration</h4>
        <p>Seamless integration between DataTable and form modals for full CRUD operations.</p>
        
        <div className="d-flex justify-content-between mb-3">
          <h5>Employee Management</h5>
          <FormCreateModalButton>
            <CreateButton>Add Employee</CreateButton>
          </FormCreateModalButton>
        </div>
        
        <DataTable
          data={users}
          columns={columns}
          // searchPlaceholder="Search employees..."
          rowsPerPageOptions={[5, 10, 25, null]}
          rowsPerPage={5}
        />
      </div>
    </FormModalProvider>
  );
};


