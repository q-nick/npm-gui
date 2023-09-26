import type { FC } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { ContextStoreProvider } from '../app/ContextStore';
import { Header } from './Header/Header';
import { Info } from './Info';
import { Project } from './Project/Project';

export const App: FC = () => {
  return (
    <ContextStoreProvider>
      <Router>
        <Route exact path="/:projectPathEncoded?">
          <Header />

          <Project />

          <Info />
        </Route>
      </Router>
    </ContextStoreProvider>
  );
};
