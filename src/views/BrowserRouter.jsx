import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, NotFound } from '.';

export default function BrowserRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />

        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}
