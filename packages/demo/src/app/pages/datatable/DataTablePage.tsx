import { Container } from 'react-bootstrap';
import {
  DataTable,
  FormCreateModalButton,
  FormModalProvider,
  useLocalStorage,
} from '@jasperoosthoek/react-toolbox';

import usersBase, { User } from './users';
import { useState } from 'react';

const DataTablePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Store users in localStorage so it persists
  const [users, setUsers] = useLocalStorage('users', usersBase);
  // const { lang } = useLocalization();
  return (
    <Container className='container-list'>
      <h2>DataTable Component</h2>
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
      </p>

      
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
        onCreate={(user, closeModal: () => void) => {
          setUsers([...users, user as User]);

          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            closeModal();
          }, 500);
        }}
        onUpdate={(user, closeModal: () => void) => {
          setUsers(users.map((u: User) => u.id === user.id ? user as User : u));

          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            closeModal();
          }, 500);
        }}
      >
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
        <FormCreateModalButton title='Create new user'/>
      </FormModalProvider>

    </Container>
  )
}

export default DataTablePage;