import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import { Header, Footer } from '../components';

export default function Layout({ children, eventName }) {
  return (
    <Container>
      <Header eventName={eventName} />

      {children}

      <Footer />
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.any.isRequired,
};
