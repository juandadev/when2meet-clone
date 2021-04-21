import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';

export default function Header({ eventName = '' }) {
  return (
    <header className="header">
      <Navbar>
        <Link to="/" className="navbar-brand">
          When2Meet Clone
        </Link>

        {eventName ? (
          <Navbar.Text>
            Event: <strong>{eventName}</strong>
          </Navbar.Text>
        ) : (
          ''
        )}
      </Navbar>
    </header>
  );
}
