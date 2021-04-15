import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import { Header, Footer } from '../components';

export default function Layout({ children }) {
  return (
    <Container>
      <Header />

      {children}

      <Footer />
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.any.isRequired,
};
