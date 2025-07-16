// Example usage of the new FormProvider architecture

import React from 'react';
import { Button } from 'react-bootstrap';
import { 
  FormProvider, 
  FormModal, 
  FormField,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
  FormDropdown,
  useForm, 
  FormModalProvider,
  FormCreateModalButton,
  FormFieldsRenderer,
} from '../index';

// Example 1: Using FormProvider with custom layout
const CustomFormExample = () => {
  // Minimal config - only essentials
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
    return errors;
  };

  return (
    <FormProvider
      formFields={formFields}
      onSubmit={handleSubmit}
      validate={validate}
    >
      <div>
        <h3>Custom Form Layout</h3>
        {/* Direct component usage - most flexible */}
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
        
        <CustomSubmitButton />
      </div>
    </FormProvider>
  );
};

// Custom submit button that uses the form context
const CustomSubmitButton = () => {
  const { submit, loading, validated } = useForm();
  
  return (
    <Button 
      onClick={submit} 
      disabled={loading || !validated}
    >
      {loading ? 'Submitting...' : 'Submit'}
    </Button>
  );
};

// Example 2: Using FormModalProvider (simplified usage)
const ModalFormExample = () => {
  // For modals, you can still pre-define everything
  const formFields = {
    title: {
      label: 'Title',
      required: true,
      initialValue: '',
    },
    description: {
      label: 'Description',
      formProps: { as: 'textarea', rows: 3 },
      initialValue: '',
    }
  };

  const handleCreate = (data: any, callback?: () => void) => {
    console.log('Creating item:', data);
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  const handleUpdate = (data: any, callback?: () => void) => {
    console.log('Updating item:', data);
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  return (
    <FormModalProvider
      formFields={formFields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      createModalTitle="Create New Item"
      editModalTitle="Edit Item"
    >
      <div>
        <h3>Modal Form Example</h3>
        <FormCreateModalButton>
          Create New Item
        </FormCreateModalButton>
        {/* FormEditModalButton would be used in a list/table context */}
      </div>
    </FormModalProvider>
  );
};

// Example 3: Using FormProvider with FormModal for maximum flexibility
const FlexibleFormExample = () => {
  const [showModal, setShowModal] = React.useState(false);
  
  const formFields = {
    username: {
      label: 'Username',
      required: true,
    },
    password: {
      label: 'Password',
      formProps: { type: 'password' },
      required: true,
    }
  };

  const handleLogin = (data: any, callback?: () => void) => {
    console.log('Login attempt:', data);
    setTimeout(() => {
      setShowModal(false);
      if (callback) callback();
    }, 1000);
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>
        Show Login Modal
      </Button>
      
      {showModal && (
        <FormProvider
          formFields={formFields}
          onSubmit={handleLogin}
          resetTrigger={showModal} // Reset form when modal opens
        >
          <FormModal
            show={showModal}
            onHide={() => setShowModal(false)}
            modalTitle="Login"
            submitText="Login"
            cancelText="Cancel"
          />
        </FormProvider>
      )}
    </div>
  );
};

// Example 4: FormFieldsRenderer with automatic component selection
const RendererFormExample = () => {
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
      formProps: { type: 'email' },
    },
    country: {
      label: 'Country',
      type: 'select' as const,
      required: true,
      initialValue: '',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
      ],
    },
    newsletter: {
      label: 'Subscribe to newsletter',
      type: 'checkbox' as const,
      initialValue: false,
    },
    bio: {
      label: 'Bio',
      type: 'textarea' as const,
      initialValue: '',
      formProps: { rows: 4 },
    }
  };

  const handleSubmit = (data: any, callback?: () => void) => {
    console.log('Auto-rendered form submitted:', data);
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  return (
    <FormProvider
      formFields={formFields}
      onSubmit={handleSubmit}
    >
      <div>
        <h3>Auto-Rendered Form</h3>
        <p>FormFieldsRenderer automatically chooses components based on config:</p>
        {/* This will render FormInput, FormSelect, FormCheckbox, FormTextarea automatically */}
        <FormFieldsRenderer />
        <CustomSubmitButton />
      </div>
    </FormProvider>
  );
};

// Example 5: Mixed approach - minimal config with direct component usage
const MixedFormExample = () => {
  const formFields = {
    username: {
      required: true,
      initialValue: '',
    },
    password: {
      required: true,
      initialValue: '',
    },
    confirmPassword: {
      required: true,
      initialValue: '',
    },
    bio: {
      initialValue: '',
    },
    newsletter: {
      initialValue: false,
    }
  };

  const validate = (data: any) => {
    const errors: any = {};
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleRegister = (data: any, callback?: () => void) => {
    console.log('Registration data:', data);
    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  };

  return (
    <FormProvider
      formFields={formFields}
      onSubmit={handleRegister}
      validate={validate}
    >
      <div>
        <h3>Registration Form</h3>
        
        {/* Mix of direct components and convenience wrappers */}
        <FormInput
          name="username" 
          label="Choose Username" 
          placeholder="Username"
          minLength={3}
        />
        
        <FormInput
          name="password" 
          label="Password" 
          type="password"
          placeholder="Enter password"
          minLength={8}
        />
        
        <FormInput
          name="confirmPassword" 
          label="Confirm Password" 
          type="password"
          placeholder="Confirm your password"
        />
        
        <FormTextarea
          name="bio" 
          label="Bio (Optional)" 
          rows={4}
          placeholder="Tell us about yourself..."
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

export { CustomFormExample, ModalFormExample, FlexibleFormExample, RendererFormExample, MixedFormExample };
