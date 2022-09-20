import type { VFC } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { ContextStoreProvider } from '../app/ContextStore';
import { Header } from './Header/Header';
import { Info } from './Info';
import { Main } from './Main';
import { ProjectTaskQueueMonitor } from './ProjectTaskQueue/ProjectTaskQueueMonitor';
import { TaskQueueContextProvider } from './TaskQueue/TaskQueueContext';

export const App: VFC = () => {
  return (
    <ContextStoreProvider>
      <TaskQueueContextProvider>
        <ProjectTaskQueueMonitor>
          <Router>
            <Route exact path="/:projectPathEncoded?">
              <Header />

              <Main />

              <Info />
            </Route>
          </Router>
        </ProjectTaskQueueMonitor>
      </TaskQueueContextProvider>
    </ContextStoreProvider>
  );
};
