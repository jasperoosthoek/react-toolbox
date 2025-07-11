// Example usage of the new FormProvider architecture

import React from 'react';
import { 
  FormProvider, 
  FormModal, 
  FormField, 
  useForm, 
  FormModalProvider,
  FormCreateModalButton 
} from '@jasperoosthoek/react-toolbox';

// Example 1: Using FormProvider with custom layout
const CustomFormExample = () => {
  const formFields = {
    name: {
      label: 'Name',
      required: true,
      initialValue: '',
    },
    email: {
      label: 'Email',
      required: true,
      type: 'string' as const,
      formProps: { type: 'email' },
    },
    age: {
      label: 'Age',
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
        <FormField name="name" />
        <FormField name="email" />
        <FormField name="age" />
        
        <CustomSubmitButton />
      </div>
    </FormProvider>
  );
};

// Custom submit button that uses the form context
const CustomSubmitButton = () => {
  const { submit, loading, validated } = useForm();
  
  return (
    <button 
      onClick={submit} 
      disabled={loading || !validated}
    >
      {loading ? 'Submitting...' : 'Submit'}
    </button>
  );
};

// Example 2: Using FormModalProvider (simplified usage)
const ModalFormExample = () => {
  const formFields = {
    title: {
      label: 'Title',
      required: true,
      initialValue: '',
    },
    description: {
      label: 'Description',
      formProps: { as: 'textarea', rows: 3 },
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
      <button onClick={() => setShowModal(true)}>
        Show Login Modal
      </button>
      
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

export { CustomFormExample, ModalFormExample, FlexibleFormExample };
