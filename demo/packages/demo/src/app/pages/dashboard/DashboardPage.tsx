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
    const employees = fetch("/api/employees")
      .then(res => res.json())
    console.log({ employees })
    const customers = fetch("/api/customers")
      .then(res => res.json())
    console.log({ customers })
  }, [])
  
  const CreateUserButton = () => <FormCreateModalButton title='Create new user'/>
  return (
    <Container className='container-list'>
        Dashboard
    </Container>
  );
}

export default DashboardPage
