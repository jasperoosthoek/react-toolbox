import { useEffect } from 'react';
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

import { useState } from 'react';

const DashboardPage = () => {
  useEffect(() => {
    const users = fetch("/api/users")
      .then(res => res.json())
    console.log({ users })
    const posts = fetch("/api/posts")
      .then(res => res.json())
    console.log({ posts })
  }, [])
  
  const CreateUserButton = () => <FormCreateModalButton title='Create new user'/>
  return (
    <Container className='container-list'>
        Dashboard
    </Container>
  );
}

export default DashboardPage
