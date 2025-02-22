import React, { ReactNode } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router';


const NavLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Nav.Item>
    <Link to={to} className='nav-item'>
      <div className='nav-link'>{children}</div>
    </Link>
  </Nav.Item>
);

const NavLinks = () => (
  <>
    <NavLink to="../datatable">Data tables</NavLink>
    <NavLink to="../form">Forms</NavLink>
  </>
)

export default NavLinks;