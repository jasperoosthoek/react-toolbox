import React, { useState } from 'react';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link, Outlet } from 'react-router';

import { MenuButton } from '@jasperoosthoek/react-toolbox';
import NavLinks from './NavLinks';
import LanguageDropdown from './LanguageDropdown';

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <Navbar bg='light'>
        <Link to='../'>
          <Navbar.Brand>Dashboard</Navbar.Brand>
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
          
          <Navbar.Text>
            <LanguageDropdown />
          </Navbar.Text>
          {/* <Nav.Link onClick={() => logout()}>{text`logout`}</Nav.Link> */}
        </Navbar.Collapse>
      </Navbar>

      {showMenu &&
        // Mobile menu that can be opened by clicking on MenuButton
        <div className='nav-menu bg-light'>
          <div className='p-0 d-md-none ms-3'>
            <div className='divider' />
            <Nav className='d-block'>
              <NavLinks />
            </Nav>
          </div>
        </div>
      }

      <Row className="full-width">
        {/* Sidebar: Visible on md+ screens, hidden on small screens */}
        <Col md="2" className="sidebar d-none d-md-block">
          <Nav className="nav-sidebar no-wrap bg-light fluid">
            <div>

              <NavLinks />
            </div>
          </Nav>
        </Col>

        {/* Main Content: Full width when sidebar is hidden */}
        <Col xs="12" md="10">
          <Outlet />
        </Col>
      </Row>
    </>
  )
}

export default Dashboard;
