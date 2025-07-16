// Mock data for DataTable examples

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  salary: number;
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  tags: string[];
}

export interface Order {
  id: number;
  customerName: string;
  product: string;
  quantity: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  orderDate: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    department: 'Engineering',
    joinDate: '2023-01-15',
    status: 'active',
    salary: 85000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Developer',
    department: 'Engineering',
    joinDate: '2023-03-20',
    status: 'active',
    salary: 75000,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Designer',
    department: 'Design',
    joinDate: '2023-02-10',
    status: 'active',
    salary: 70000,
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'Manager',
    department: 'Marketing',
    joinDate: '2022-11-05',
    status: 'active',
    salary: 90000,
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    role: 'Developer',
    department: 'Engineering',
    joinDate: '2023-04-12',
    status: 'pending',
    salary: 72000,
  },
  {
    id: 6,
    name: 'Diana Davis',
    email: 'diana.davis@example.com',
    role: 'Analyst',
    department: 'Finance',
    joinDate: '2023-01-30',
    status: 'active',
    salary: 68000,
  },
  {
    id: 7,
    name: 'Eva Garcia',
    email: 'eva.garcia@example.com',
    role: 'Developer',
    department: 'Engineering',
    joinDate: '2023-05-15',
    status: 'inactive',
    salary: 76000,
  },
  {
    id: 8,
    name: 'Frank Miller',
    email: 'frank.miller@example.com',
    role: 'Designer',
    department: 'Design',
    joinDate: '2023-03-08',
    status: 'active',
    salary: 71000,
  },
  {
    id: 9,
    name: 'Grace Lee',
    email: 'grace.lee@example.com',
    role: 'Manager',
    department: 'HR',
    joinDate: '2022-12-01',
    status: 'active',
    salary: 85000,
  },
  {
    id: 10,
    name: 'Henry Taylor',
    email: 'henry.taylor@example.com',
    role: 'Developer',
    department: 'Engineering',
    joinDate: '2023-06-01',
    status: 'pending',
    salary: 74000,
  },
  {
    id: 11,
    name: 'Ivy Anderson',
    email: 'ivy.anderson@example.com',
    role: 'Analyst',
    department: 'Finance',
    joinDate: '2023-02-20',
    status: 'active',
    salary: 69000,
  },
  {
    id: 12,
    name: 'Jack Thompson',
    email: 'jack.thompson@example.com',
    role: 'Designer',
    department: 'Design',
    joinDate: '2023-04-05',
    status: 'active',
    salary: 73000,
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro',
    category: 'Electronics',
    price: 1299.99,
    stock: 45,
    description: 'High-performance laptop for professionals',
    tags: ['laptop', 'computer', 'work'],
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 29.99,
    stock: 120,
    description: 'Ergonomic wireless mouse',
    tags: ['mouse', 'wireless', 'office'],
  },
  {
    id: 3,
    name: 'Office Chair',
    category: 'Furniture',
    price: 249.99,
    stock: 18,
    description: 'Comfortable ergonomic office chair',
    tags: ['chair', 'office', 'furniture'],
  },
  {
    id: 4,
    name: 'Monitor 27"',
    category: 'Electronics',
    price: 329.99,
    stock: 32,
    description: '27-inch 4K monitor',
    tags: ['monitor', 'display', 'screen'],
  },
  {
    id: 5,
    name: 'Keyboard Mechanical',
    category: 'Electronics',
    price: 89.99,
    stock: 67,
    description: 'Mechanical keyboard with RGB lighting',
    tags: ['keyboard', 'mechanical', 'RGB'],
  },
];

export const mockOrders: Order[] = [
  {
    id: 1001,
    customerName: 'John Doe',
    product: 'Laptop Pro',
    quantity: 1,
    total: 1299.99,
    status: 'delivered',
    orderDate: '2023-06-15',
  },
  {
    id: 1002,
    customerName: 'Jane Smith',
    product: 'Wireless Mouse',
    quantity: 2,
    total: 59.98,
    status: 'shipped',
    orderDate: '2023-06-18',
  },
  {
    id: 1003,
    customerName: 'Bob Johnson',
    product: 'Office Chair',
    quantity: 1,
    total: 249.99,
    status: 'processing',
    orderDate: '2023-06-20',
  },
  {
    id: 1004,
    customerName: 'Alice Brown',
    product: 'Monitor 27"',
    quantity: 2,
    total: 659.98,
    status: 'pending',
    orderDate: '2023-06-22',
  },
  {
    id: 1005,
    customerName: 'Charlie Wilson',
    product: 'Keyboard Mechanical',
    quantity: 1,
    total: 89.99,
    status: 'delivered',
    orderDate: '2023-06-14',
  },
];

// Helper functions for examples
export const getStatusBadge = (status: string) => {
  const statusClasses = {
    active: 'badge bg-success',
    inactive: 'badge bg-secondary',
    pending: 'badge bg-warning',
    delivered: 'badge bg-success',
    shipped: 'badge bg-info',
    processing: 'badge bg-warning',
  };
  return statusClasses[status as keyof typeof statusClasses] || 'badge bg-secondary';
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
