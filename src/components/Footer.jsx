import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer>
      <Row>
        <Col>
          <p>
            Made with 💚 by{' '}
            <a href="https://github.com/thomasnrggo">Anthony Gonzalez</a> and{' '}
            <a href="https://juanda.dev">Juan Daniel Martínez</a>
          </p>
        </Col>
      </Row>
    </footer>
  );
}
