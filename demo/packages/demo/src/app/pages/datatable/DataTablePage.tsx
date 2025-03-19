import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalStorage,
  DeleteConfirmButton,
  ConfirmButton,
  ResetButton,
} from '@jasperoosthoek/react-toolbox';

import usersBase, { User } from './users';
import { useState } from 'react';

const DataTablePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Store users in localStorage so it persists
  const [users, setUsers] = useLocalStorage('users', usersBase);
  // const { lang } = useLocalization();
  
  const CreateUserButton = () => <FormCreateModalButton title='Create new user'/>
  return (
    <Container className='container-list'>
      <FormModalProvider
        loading={isLoading}
        initialState={{
          name: '',
          email: '',
          role: '',
          id: users.length + 1,
          order: users.length,
        }}
        createModalTitle={'Create new user'}
        editModalTitle={'Edit user'}
        formFields={{
          name: {
            label: 'Name',
            required: true,
          },
          email: {
            label: 'Email address',
            required: true,
          },
          role: {
            label: 'Role'
          }
        }}
        validate={({ email }) => {
          // You can add more sophisticated validation here
          const es = email.split('@')
          if (es.length !== 2) {
            return {
              email: 'Email address should contain at least one @',
            }
          }
        }}
        onCreate={(user, closeModal: () => void) => {
          setUsers([...users, user as User]);

          // Fake 500 ms loading time in the backend
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            closeModal();
          }, 500);
        }}
        onUpdate={(user, closeModal: () => void) => {
          setUsers(users.map((u: User) => u.id === user.id ? user as User : u));
          
          // Fake 500 ms loading time in the backend
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            closeModal();
          }, 500);
        }}
      >
        <h2>The DataTable component</h2>
        <p>
          This is a <strong>highly customizable and interactive DataTable component</strong>.
          It provides a seamless user experience with powerful features, making it ideal for displaying and managing data efficiently while keeping development time to a minimum.
        </p>

        <h3>Key Features</h3>
        <ul>
          <li><strong>Column Sorting</strong> – Click column headers to sort data in ascending or descending order.</li>
          <li><strong>Pagination</strong> – Navigate through large datasets smoothly with built-in pagination.</li>
          <li><strong>Drag & Drop</strong> – Easily reorder rows or columns via intuitive drag-and-drop functionality.</li>
          <li><strong>Row Click to Edit</strong> – Open a modal with an edit form when clicking a row for quick updates.</li>
          <li><strong>Search & Filter</strong> – Instantly find relevant data with a real-time search input.</li>
        </ul>

        <p>
          This component is designed for <strong>performance, accessibility, and flexibility</strong>,
          making it a powerful solution for handling complex data visualization in any React application. 🚀
          Play around with the DataTable component, all changes are kept in <code>localStorage</code>.
          You can add new users below by pressing the create button below or here <CreateUserButton />,
          delete users and update users by clicking the row,
          or reset data by clicking
          <ConfirmButton
            modalTitle='Reset user data'
            buttonComponent={ResetButton}
            onConfirm={() => setUsers(usersBase)}
          />.
        </p>
        
        <DataTable
          orderByDefault='order'
          showEditModalOnClickRow
          filterColumn={({ name, email, role}: User) => `${name} ${email} ${role}`}
          columns={[
            {
              // Display column name
              name: 'Name',
              // Select by key
              selector: 'name',
              orderBy: 'name',
            },
            {
              name: 'Email',
              // Select using function which outputs string, number or ReactNode
              selector: ({ email }: User) => (
                <a href={`mailto: ${email}`}>{email}</a>
              ),
            },
            {
              name: 'Company role',
              selector: 'role',
              orderBy: 'role',
            },
            {
              name: 'Actions',
              selector: (user) => (
                <DeleteConfirmButton
                  modalTitle={`Delete user "${user.name}?`}
                  onDelete={() => {
                    // Get index of item to delete
                    const index = users.findIndex(u => u.id === user.id);
                    // Remove from users list
                    users.splice(index, 1)
                    // Store users and make sure to update order field
                    setUsers(users.map((u, order) => ({...u, order })));
                  }}
                />
              )
            }
          ]}
          data={users}
          onMove={({ item, target }) => {
            // Use onMove to store new position for instance by modifying the 'order' field
            // with django-ordered-model in a Django backend

            // Find index of the item to move
            const fromIndex = users.findIndex(user => user.id === item.id);
            if (fromIndex === -1) return; // If not found, return original array

            // Find index of the target position (user with `orderId` as their order)
            const targetIndex = users.findIndex(user => user.id === target.id);
            if (targetIndex === -1) return; // If target not found, return original array

            // Remove the item from its current position
            const [movedUser] = users.splice(fromIndex, 1);

            // Insert the item at the target position
            users.splice(targetIndex, 0, movedUser);

            users.map(u => console.log(u.id))
            setUsers(users.map((u, order) => ({...u, order })));
          }}
        />
        <CreateUserButton />
      </FormModalProvider>

    </Container>
  )
}

export default DataTablePage;