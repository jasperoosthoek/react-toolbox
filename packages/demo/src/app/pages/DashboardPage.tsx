import React, { useState } from 'react';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link, Outlet } from 'react-router';

import { MenuButton } from '@jasperoosthoek/react-toolbox';
import NavLinks from '../components/NavLinks';

const DashboardPage = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <Navbar bg='light'>
        <Link to='../'>
          <Navbar.Brand>React-Toolbox</Navbar.Brand>
        </Link>
        <MenuButton
          className='p-0 d-md-none ms-3'
          onClick={() => setShowMenu(!showMenu)}
        />
        <Nav className='mr-auto'>
          <Navbar.Text className='dashboard-title'>
            <div></div>
          </Navbar.Text>
        </Nav>
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text>
          </Navbar.Text>
          &nbsp;
          {/* <Nav.Link onClick={() => logout()}>Logout</Nav.Link> */}
        </Navbar.Collapse>
      </Navbar>

      {showMenu &&
        <div className='nav-menu bg-light'>
          <div className='p-0 d-md-none ms-3'>
            <div className='divider' />
            <Nav className='d-block'>
              <NavLinks />
            </Nav>
          </div>
        </div>
      }

      <Row className='full-width'>
        <Col sm='2' className='sidebar'>
          <Nav className='nav-sidebar no-wrap d-none d-md-block bg-light fluid'>
            <NavLinks />
          </Nav>
        </Col>
        <Col sm='10'>
          <Outlet />
        </Col>
      </Row>
    </>
  )
}

export default DashboardPage;
