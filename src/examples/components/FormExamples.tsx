import React, { useState } from 'react';
import { Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { 
  FormProvider, 
  FormModal,
  FormModalProvider,
  FormCreateModalButton,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
  FormDropdown,
  FormBadgesSelection,
  useForm,
  useFormModal
} from '../../index';
import { ExampleSection } from './ExampleSection';
import { mockUsers, User } from '../data/mockData';

// FormActions component for consistent button spacing
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({ children, className = '' }) => {
  return (
    <div className={`d-flex gap-2 align-items-center mt-3 ${className}`}>
      {children}
    </div>
  );
};

// Example 1: Using FormProvider with custom layout
const CustomFormExampleComponent = () => {
  const formFields = {
    name: {
      required: true,
      initialValue: '',
    },
    email: {
      required: true,
      initialValue: '',
    },
    age: {
      type: 'number' as const,
      initialValue: 0,
    },
    newsletter: {
      initialValue: false,
    }
  };

  const handleSubmit = (data: any, callback?: () => void) => {
    console.log('Form submitted:', data);
    // Simulate API call
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const validate = (data: any) => {
    const errors: any = {};
    if (data.email && !data.email.includes('@')) {
      errors.email = 'Invalid email format';
    }
    if (data.age && (data.age < 0 || data.age > 120)) {
      errors.age = 'Age must be between 0 and 120';
    }
    return errors;
  };

  return (
    <FormProvider
      formFields={formFields}
      onSubmit={handleSubmit}
      validate={validate}
    >
      <div>
        <FormInput
          name="name" 
          label="Full Name" 
          placeholder="Enter your full name"
        />
        <FormInput
          name="email" 
          label="Email Address" 
          type="email"
          placeholder="Enter your email"
        />
        <FormInput
          name="age" 
          label="Age" 
          type="number"
          min={0}
          max={120}
        />
        <FormCheckbox
          name="newsletter"
          label="Subscribe to newsletter"
        />
        
        <CustomSubmitButton />
      </div>
    </FormProvider>
  );
};

// Custom submit button that uses the form context
const CustomSubmitButton = () => {
  const { submit, loading } = useForm();
  
  return (
    <FormActions>
      <Button 
        onClick={submit} 
        disabled={loading} // Only disable during loading
        variant="primary"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </FormActions>
  );
};

// Example 2: Modal Forms with FormModalProvider
const ModalFormExampleComponent = () => {
  const [users, setUsers] = useState<User[]>(mockUsers.slice(0, 3));

  const userFormFields = {
    name: { 
      type: 'string' as const,
      required: true, 
      initialValue: '',
      label: 'Full Name',
      formProps: { placeholder: 'Enter full name' }
    },
    email: { 
      type: 'string' as const,
      required: true, 
      initialValue: '',
      label: 'Email Address',
      formProps: { type: 'email', placeholder: 'Enter email address' }
    },
    role: { 
      type: 'select' as const,
      required: true, 
      initialValue: '',
      label: 'Role',
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Developer', label: 'Developer' },
        { value: 'Designer', label: 'Designer' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Analyst', label: 'Analyst' }
      ]
    },
    department: { 
      type: 'select' as const,
      required: true, 
      initialValue: '',
      label: 'Department',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Design', label: 'Design' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Finance', label: 'Finance' },
        { value: 'HR', label: 'HR' }
      ]
    },
    salary: { 
      type: 'number' as const,
      initialValue: 0,
      label: 'Salary',
      formProps: { min: 0, placeholder: 'Enter salary amount' }
    }
  };

  const handleCreate = (data: any, callback?: () => void) => {
    console.log('Creating user:', data);
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...data,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active' as const
    };
    setUsers([...users, newUser]);
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const handleUpdate = (data: any, callback?: () => void) => {
    console.log('Updating user:', data);
    setUsers(users.map(user => 
      user.id === data.id ? { ...user, ...data } : user
    ));
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const UserList = () => {
    const { showEditModal } = useFormModal();
    
    return (
      <div>
        <div className="mb-3">
          <FormCreateModalButton variant="primary">
            Create New User
          </FormCreateModalButton>
        </div>

        <Card>
          <Card.Header>
            <h5>Users</h5>
          </Card.Header>
          <Card.Body>
            {users.map(user => (
              <div key={user.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                <div>
                  <strong>{user.name}</strong> - {user.role}
                  <br />
                  <small className="text-muted">{user.email}</small>
                </div>
                <Button 
                  size="sm" 
                  variant="outline-primary"
                  onClick={() => showEditModal(user)}
                >
                  Edit
                </Button>
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <FormModalProvider
      formFields={userFormFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      createModalTitle="Create New User"
      editModalTitle="Edit User"
    >
      <UserList />
    </FormModalProvider>
  );
};

// Example 3: Flexible Forms with FormProvider + FormModal integration
const FlexibleFormExampleComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const contactFormFields = {
    firstName: { required: true, initialValue: '' },
    lastName: { required: true, initialValue: '' },
    email: { required: true, initialValue: '' },
    phone: { initialValue: '' },
    message: { required: true, initialValue: '' },
    contactMethod: { initialValue: 'email' },
    urgent: { initialValue: false }
  };

  const handleSubmit = (data: any, callback?: () => void) => {
    console.log('Contact form submitted:', data);
    setSubmitMessage(`Thank you ${data.firstName}! We'll contact you via ${data.contactMethod}.`);
    setShowModal(false);
    setEditData(null);
    setTimeout(() => {
      if (callback) callback();
      setSubmitMessage('');
    }, 3000);
  };

  const validate = (data: any) => {
    const errors: any = {};
    if (data.email && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Please enter a valid email address';
    }
    if (data.phone && data.phone.length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }
    if (data.message && data.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    return errors;
  };

  const contactMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'both', label: 'Both Email and Phone' }
  ];

  return (
    <div>
      {submitMessage && (
        <Alert variant="success" className="mb-3">
          {submitMessage}
        </Alert>
      )}
      
      <div className="mb-3">
        <Button 
          variant="primary"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        >
          Open Contact Form
        </Button>
        
        <Button 
          variant="outline-secondary"
          className="ms-2"
          onClick={() => {
            setEditData({
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phone: '555-0123',
              message: 'I need help with my account.',
              contactMethod: 'email',
              urgent: true
            });
            setShowModal(true);
          }}
        >
          Edit Sample Data
        </Button>
      </div>

      <FormProvider
        formFields={contactFormFields}
        onSubmit={handleSubmit}
        validate={validate}
        initialState={editData}
      >
        <FormModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalTitle={editData ? "Edit Contact Request" : "Contact Us"}
          width={75}
        >
          <Row>
            <Col md={6}>
              <FormInput name="firstName" label="First Name" />
            </Col>
            <Col md={6}>
              <FormInput name="lastName" label="Last Name" />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormInput name="email" label="Email" type="email" />
            </Col>
            <Col md={6}>
              <FormInput name="phone" label="Phone" />
            </Col>
          </Row>
          <FormSelect 
            name="contactMethod" 
            label="Preferred Contact Method" 
            list={contactMethodOptions} 
          />
          <FormTextarea 
            name="message" 
            label="Message" 
            rows={4}
            placeholder="Please describe how we can help you..."
          />
          <FormCheckbox 
            name="urgent" 
            label="This is urgent - please prioritize my request" 
          />
        </FormModal>
      </FormProvider>
    </div>
  );
};

// Example 4: Auto-Rendered Forms using FormField pattern
const RendererFormExampleComponent = () => {
  const [formData, setFormData] = useState<any>({});

  const surveyFormFields = {
    name: { 
      type: 'text' as const,
      required: true, 
      initialValue: '',
      label: 'Full Name',
      placeholder: 'Enter your full name'
    },
    age: { 
      type: 'number' as const,
      initialValue: 0,
      label: 'Age',
      min: 18,
      max: 100
    },
    experience: {
      type: 'select' as const,
      required: true,
      initialValue: '',
      label: 'Experience Level',
      options: [
        { value: 'beginner', label: 'Beginner (0-2 years)' },
        { value: 'intermediate', label: 'Intermediate (3-5 years)' },
        { value: 'advanced', label: 'Advanced (6+ years)' }
      ]
    },
    skills: {
      type: 'badges' as const,
      initialValue: [],
      label: 'Skills',
      options: [
        { value: 'react', label: 'React' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'node', label: 'Node.js' },
        { value: 'python', label: 'Python' },
        { value: 'design', label: 'UI/UX Design' },
        { value: 'testing', label: 'Testing' }
      ]
    },
    remote: {
      type: 'checkbox' as const,
      initialValue: false,
      label: 'Open to remote work'
    },
    comments: {
      type: 'textarea' as const,
      initialValue: '',
      label: 'Additional Comments',
      placeholder: 'Tell us anything else we should know...',
      rows: 3
    }
  };

  const handleSubmit = (data: any, callback?: () => void) => {
    console.log('Survey submitted:', data);
    setFormData(data);
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  // Simple field renderer
  const renderField = (name: string, config: any) => {
    const commonProps = {
      name,
      label: config.label,
      placeholder: config.placeholder,
      required: config.required
    };

    switch (config.type) {
      case 'text':
      case 'number':
        return (
          <FormInput
            key={name}
            {...commonProps}
            type={config.type}
            min={config.min}
            max={config.max}
          />
        );
      case 'select':
        return (
          <FormSelect
            key={name}
            {...commonProps}
            list={config.options}
          />
        );
      case 'badges':
        return (
          <FormBadgesSelection
            key={name}
            {...commonProps}
            list={config.options}
          />
        );
      case 'checkbox':
        return (
          <FormCheckbox
            key={name}
            name={name}
            label={config.label}
          />
        );
      case 'textarea':
        return (
          <FormTextarea
            key={name}
            {...commonProps}
            rows={config.rows}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <FormProvider
        formFields={surveyFormFields}
        onSubmit={handleSubmit}
      >
        <div>
          <h5>Developer Survey</h5>
          <p className="text-muted mb-4">
            Help us understand your background and preferences
          </p>

          {Object.entries(surveyFormFields).map(([name, config]) =>
            renderField(name, config)
          )}

          <CustomSubmitButton />
        </div>
      </FormProvider>

      {Object.keys(formData).length > 0 && (
        <Card className="mt-4">
          <Card.Header>
            <h6>Submitted Data</h6>
          </Card.Header>
          <Card.Body>
            <pre className="small">{JSON.stringify(formData, null, 2)}</pre>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

// Example 5: Mixed Form Approach - Direct components with convenience wrappers
const MixedFormExampleComponent = () => {
  const [orderData, setOrderData] = useState<any>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const orderFormFields = {
    customerName: { required: true, initialValue: '' },
    email: { required: true, initialValue: '' },
    product: { required: true, initialValue: '' },
    quantity: { type: 'number' as const, initialValue: 1 },
    priority: { initialValue: 'normal' },
    specialInstructions: { initialValue: '' },
    newsletter: { initialValue: true },
    terms: { required: true, initialValue: false }
  };

  const handleSubmit = (data: any, callback?: () => void) => {
    console.log('Order submitted:', data);
    setOrderData(data);
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const validate = (data: any) => {
    const errors: any = {};
    if (data.email && !data.email.includes('@')) {
      errors.email = 'Invalid email format';
    }
    if (data.quantity && data.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }
    if (!data.terms) {
      errors.terms = 'You must accept the terms and conditions';
    }
    return errors;
  };

  const productOptions = [
    { value: 'laptop', label: 'Laptop Pro - $1,299' },
    { value: 'mouse', label: 'Wireless Mouse - $29' },
    { value: 'keyboard', label: 'Mechanical Keyboard - $89' },
    { value: 'monitor', label: '27" Monitor - $329' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Priority (+$10)' },
    { value: 'urgent', label: 'Urgent (+$25)' }
  ];

  return (
    <div>
      <FormProvider
        formFields={orderFormFields}
        onSubmit={handleSubmit}
        validate={validate}
      >
        <div>
          <h5>Product Order Form</h5>
          
          {/* Basic Information */}
          <Card className="mb-3">
            <Card.Header>Customer Information</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <FormInput 
                    name="customerName" 
                    label="Customer Name" 
                    placeholder="Enter full name"
                  />
                </Col>
                <Col md={6}>
                  <FormInput 
                    name="email" 
                    label="Email Address" 
                    type="email"
                    placeholder="customer@example.com"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Order Details */}
          <Card className="mb-3">
            <Card.Header>Order Details</Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <FormDropdown 
                    name="product" 
                    label="Select Product"
                    list={productOptions}
                    placeholder="Choose a product..."
                  />
                </Col>
                <Col md={4}>
                  <FormInput 
                    name="quantity" 
                    label="Quantity" 
                    type="number"
                    min={1}
                    max={10}
                  />
                </Col>
              </Row>
              
              <FormSelect 
                name="priority" 
                label="Shipping Priority"
                list={priorityOptions}
              />
            </Card.Body>
          </Card>

          {/* Advanced Options */}
          <Card className="mb-3">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <span>Additional Options</span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </Button>
              </div>
            </Card.Header>
            {showAdvanced && (
              <Card.Body>
                <FormTextarea 
                  name="specialInstructions" 
                  label="Special Instructions"
                  placeholder="Any special delivery instructions or notes..."
                  rows={3}
                />
                <FormCheckbox 
                  name="newsletter" 
                  label="Subscribe to product updates and newsletters"
                />
              </Card.Body>
            )}
          </Card>

          {/* Terms and Submit */}
          <div className="mb-3">
            <FormCheckbox 
              name="terms" 
              label={
                <span>
                  I agree to the{' '}
                  <a href="#terms" onClick={(e) => e.preventDefault()}>
                    Terms and Conditions
                  </a>
                </span>
              }
            />
          </div>

          <CustomSubmitButton />
        </div>
      </FormProvider>

      {Object.keys(orderData).length > 0 && (
        <Alert variant="success" className="mt-4">
          <h6>Order Confirmed!</h6>
          <p className="mb-0">
            Thank you {orderData.customerName}! Your order for {orderData.quantity}x {orderData.product} has been submitted.
          </p>
        </Alert>
      )}
    </div>
  );
};

// Wrapped examples with code display
export const CustomFormExample = () => {
  const code = `import React from 'react';
import { Button } from 'react-bootstrap';
import { 
  FormProvider, 
  FormInput,
  FormCheckbox,
  useForm
} from '@jasperoosthoek/react-toolbox';

const MyForm = () => {
  const formFields = {
    name: { required: true, initialValue: '' },
    email: { required: true, initialValue: '' },
    age: { type: 'number', initialValue: 0 },
    newsletter: { initialValue: false }
  };

  const handleSubmit = (data, callback) => {
    console.log('Form submitted:', data);
    // API call here
    setTimeout(callback, 1000);
  };

  const validate = (data) => {
    const errors = {};
    if (data.email && !data.email.includes('@')) {
      errors.email = 'Invalid email format';
    }
    return errors;
  };

  return (
    <FormProvider
      formFields={formFields}
      onSubmit={handleSubmit}
      validate={validate}
    >
      <FormInput name="name" label="Full Name" />
      <FormInput name="email" label="Email" type="email" />
      <FormInput name="age" label="Age" type="number" />
      <FormCheckbox name="newsletter" label="Subscribe" />
      <SubmitButton />
    </FormProvider>
  );
};

const SubmitButton = () => {
  const { submit, loading, validated } = useForm();
  
  return (
    <Button 
      onClick={submit} 
      disabled={loading || !validated}
    >
      {loading ? 'Submitting...' : 'Submit'}
    </Button>
  );
};`;

  return (
    <ExampleSection
      title="Custom Form Layout"
      description="Using FormProvider with direct component usage for maximum flexibility"
      code={code}
      features={['FormProvider', 'Custom Layout', 'Validation', 'Loading States']}
      notes={[
        'FormProvider manages form state and validation automatically',
        'Use useForm() hook to access form context in child components',
        'Custom validation functions return error objects',
        'Loading states are handled automatically during submission'
      ]}
    >
      <CustomFormExampleComponent />
    </ExampleSection>
  );
};

export const ModalFormExample = () => {
  const code = `import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { 
  FormModalProvider,
  FormCreateModalButton,
  useFormModal
} from '@jasperoosthoek/react-toolbox';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  // FormModalProvider automatically renders form fields from this config
  const userFormFields = {
    name: { 
      type: 'string',
      required: true, 
      initialValue: '',
      label: 'Full Name',
      formProps: { placeholder: 'Enter full name' }
    },
    email: { 
      type: 'string',
      required: true, 
      initialValue: '',
      label: 'Email Address',
      formProps: { type: 'email' }
    },
    role: { 
      type: 'select',
      required: true, 
      initialValue: '',
      label: 'Role',
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Developer', label: 'Developer' },
        { value: 'Manager', label: 'Manager' }
      ]
    },
    department: { 
      type: 'select',
      required: true, 
      initialValue: '',
      label: 'Department',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Design', label: 'Design' },
        { value: 'HR', label: 'HR' }
      ]
    }
  };

  const handleCreate = (data, callback) => {
    const newUser = { id: Date.now(), ...data };
    setUsers([...users, newUser]);
    setTimeout(callback, 1000);
  };

  const handleUpdate = (data, callback) => {
    setUsers(users.map(user => 
      user.id === data.id ? { ...user, ...data } : user
    ));
    setTimeout(callback, 1000);
  };

  const UserList = () => {
    const { showEditModal } = useFormModal();
    
    return (
      <div>
        <FormCreateModalButton variant="primary">
          Create New User
        </FormCreateModalButton>

        <Card className="mt-3">
          <Card.Body>
            {users.map(user => (
              <div key={user.id} className="d-flex justify-content-between mb-2">
                <span>{user.name} - {user.role}</span>
                <Button 
                  size="sm" 
                  onClick={() => showEditModal(user)}
                >
                  Edit
                </Button>
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <FormModalProvider
      formFields={userFormFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      createModalTitle="Create User"
      editModalTitle="Edit User"
    >
      <UserList />
    </FormModalProvider>
  );
};`;

  return (
    <ExampleSection
      title="Modal Forms"
      description="FormModalProvider for create/edit modals with automatic state management"
      code={code}
      features={['FormModalProvider', 'Create/Edit Modals', 'State Management', 'CRUD Operations']}
      notes={[
        'FormModalProvider automatically creates FormModal with FormFieldsRenderer',
        'Form fields are automatically generated from formFields configuration',
        'Include type, label, options, and formProps in field config for proper rendering',
        'useFormModal() hook provides showEditModal() and showCreateModal() functions',
        'No need to manually include FormModal - it\'s created automatically'
      ]}
    >
      <ModalFormExampleComponent />
    </ExampleSection>
  );
};

export const FlexibleFormExample = () => {
  const code = `import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { 
  FormProvider, 
  FormModal,
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox
} from '@jasperoosthoek/react-toolbox';

const ContactForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const formFields = {
    firstName: { required: true, initialValue: '' },
    lastName: { required: true, initialValue: '' },
    email: { required: true, initialValue: '' },
    phone: { initialValue: '' },
    message: { required: true, initialValue: '' },
    contactMethod: { initialValue: 'email' },
    urgent: { initialValue: false }
  };

  const handleSubmit = (data, callback) => {
    console.log('Contact form:', data);
    setShowModal(false);
    setTimeout(callback, 1000);
  };

  const validate = (data) => {
    const errors = {};
    if (data.email && !data.email.match(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)) {
      errors.email = 'Please enter a valid email';
    }
    return errors;
  };

  const contactMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'both', label: 'Both' }
  ];

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>
        Contact Us
      </Button>

      <FormProvider
        formFields={formFields}
        onSubmit={handleSubmit}
        validate={validate}
        initialState={editData}
      >
        <FormModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalTitle="Contact Us"
          width={75}
        >
          <Row>
            <Col md={6}>
              <FormInput name="firstName" label="First Name" />
            </Col>
            <Col md={6}>
              <FormInput name="lastName" label="Last Name" />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormInput name="email" label="Email" type="email" />
            </Col>
            <Col md={6}>
              <FormInput name="phone" label="Phone" />
            </Col>
          </Row>
          <FormSelect 
            name="contactMethod" 
            label="Contact Method" 
            list={contactMethods} 
          />
          <FormTextarea 
            name="message" 
            label="Message" 
            rows={4}
          />
          <FormCheckbox 
            name="urgent" 
            label="This is urgent" 
          />
        </FormModal>
      </FormProvider>
    </div>
  );
};`;

  return (
    <ExampleSection
      title="Flexible Forms"
      description="FormProvider with FormModal integration for complex layouts and workflows"
      code={code}
      features={['FormProvider + FormModal', 'Complex Layouts', 'Multi-Column Forms', 'Conditional Logic']}
      notes={[
        'Combine FormProvider with FormModal for flexible form layouts',
        'Use initialState prop to pre-populate forms for editing',
        'Row and Col components create responsive multi-column layouts',
        'Custom validation can include complex business logic'
      ]}
    >
      <FlexibleFormExampleComponent />
    </ExampleSection>
  );
};

export const RendererFormExample = () => {
  const code = `import React from 'react';
import { 
  FormProvider,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
  FormBadgesSelection
} from '@jasperoosthoek/react-toolbox';

const SurveyForm = () => {
  const formFields = {
    name: { 
      type: 'text',
      required: true, 
      label: 'Full Name',
      initialValue: ''
    },
    experience: {
      type: 'select',
      required: true,
      label: 'Experience Level',
      initialValue: '',
      options: [
        { value: 'beginner', label: 'Beginner (0-2 years)' },
        { value: 'intermediate', label: 'Intermediate (3-5 years)' },
        { value: 'advanced', label: 'Advanced (6+ years)' }
      ]
    },
    skills: {
      type: 'badges',
      label: 'Skills',
      initialValue: [],
      options: [
        { value: 'react', label: 'React' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'node', label: 'Node.js' }
      ]
    },
    remote: {
      type: 'checkbox',
      label: 'Open to remote work',
      initialValue: false
    },
    comments: {
      type: 'textarea',
      label: 'Comments',
      initialValue: '',
      rows: 3
    }
  };

  const renderField = (name, config) => {
    const props = {
      name,
      label: config.label,
      required: config.required
    };

    switch (config.type) {
      case 'text':
        return <FormInput key={name} {...props} />;
      case 'select':
        return <FormSelect key={name} {...props} list={config.options} />;
      case 'badges':
        return <FormBadgesSelection key={name} {...props} list={config.options} />;
      case 'checkbox':
        return <FormCheckbox key={name} name={name} label={config.label} />;
      case 'textarea':
        return <FormTextarea key={name} {...props} rows={config.rows} />;
    }
  };

  return (
    <FormProvider formFields={formFields} onSubmit={handleSubmit}>
      {Object.entries(formFields).map(([name, config]) =>
        renderField(name, config)
      )}
      <SubmitButton />
    </FormProvider>
  );
};`;

  return (
    <ExampleSection
      title="Auto-Rendered Forms"
      description="Dynamic form rendering using field configuration objects"
      code={code}
      features={['Dynamic Rendering', 'Configuration-Based', 'Multiple Field Types', 'Schema-Driven']}
      notes={[
        'Define form structure using configuration objects',
        'Single renderField function handles all field types',
        'Easy to add new field types by extending the switch statement',
        'Great for forms generated from API schemas or CMS data'
      ]}
    >
      <RendererFormExampleComponent />
    </ExampleSection>
  );
};

export const MixedFormExample = () => {
  const code = `import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { 
  FormProvider,
  FormInput,
  FormDropdown,
  FormSelect,
  FormTextarea,
  FormCheckbox
} from '@jasperoosthoek/react-toolbox';

const OrderForm = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formFields = {
    customerName: { required: true, initialValue: '' },
    email: { required: true, initialValue: '' },
    product: { required: true, initialValue: '' },
    quantity: { type: 'number', initialValue: 1 },
    priority: { initialValue: 'normal' },
    specialInstructions: { initialValue: '' },
    newsletter: { initialValue: true },
    terms: { required: true, initialValue: false }
  };

  const productOptions = [
    { value: 'laptop', label: 'Laptop Pro - $1,299' },
    { value: 'mouse', label: 'Wireless Mouse - $29' },
    { value: 'keyboard', label: 'Mechanical Keyboard - $89' }
  ];

  const priorityOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Priority (+$10)' },
    { value: 'urgent', label: 'Urgent (+$25)' }
  ];

  return (
    <FormProvider formFields={formFields} onSubmit={handleSubmit}>
      {/* Customer Information */}
      <Card className="mb-3">
        <Card.Header>Customer Information</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <FormInput name="customerName" label="Customer Name" />
            </Col>
            <Col md={6}>
              <FormInput name="email" label="Email" type="email" />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Order Details */}
      <Card className="mb-3">
        <Card.Header>Order Details</Card.Header>
        <Card.Body>
          <FormDropdown 
            name="product" 
            label="Select Product"
            list={productOptions}
          />
          <Row>
            <Col md={6}>
              <FormInput name="quantity" label="Quantity" type="number" />
            </Col>
            <Col md={6}>
              <FormSelect name="priority" label="Priority" list={priorityOptions} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Advanced Options */}
      <Card className="mb-3">
        <Card.Header>
          <div className="d-flex justify-content-between">
            <span>Additional Options</span>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </Card.Header>
        {showAdvanced && (
          <Card.Body>
            <FormTextarea 
              name="specialInstructions" 
              label="Special Instructions"
              rows={3}
            />
            <FormCheckbox 
              name="newsletter" 
              label="Subscribe to updates"
            />
          </Card.Body>
        )}
      </Card>

      <FormCheckbox 
        name="terms" 
        label="I agree to the Terms and Conditions"
      />
      
      <SubmitButton />
    </FormProvider>
  );
};`;

  return (
    <ExampleSection
      title="Mixed Form Approach"
      description="Combining direct components with convenience wrappers and advanced layouts"
      code={code}
      features={['Card Layouts', 'Conditional Sections', 'Mixed Components', 'Complex Forms']}
      notes={[
        'Use Card components to organize form sections logically',
        'Combine different form components based on your needs',
        'Conditional rendering for optional or advanced sections',
        'Perfect for complex business forms with multiple sections'
      ]}
    >
      <MixedFormExampleComponent />
    </ExampleSection>
  );
};
