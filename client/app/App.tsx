// eslint-disable-next-line import/no-unassigned-import
import 'open-iconic/font/css/open-iconic.css';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { Global } from '../components/Global';
import { Info } from '../components/Info';
import { Project } from '../components/Project';
import { Schedule } from '../components/Schedule/Schedule';
import {
  ScheduleContext,
  useScheduleContextValue,
} from '../components/Schedule/ScheduleContext';
import { StoreContext, useStoreContextValue } from './StoreContext';

export const App: React.FC = () => {
  const storeContextValue = useStoreContextValue();
  const scheduleContextValue = useScheduleContextValue();

  return (
    <>
      <StoreContext.Provider value={storeContextValue}>
        <ScheduleContext.Provider value={scheduleContextValue}>
          <Router>
            <Switch>
              <Route exact path="/">
                <Global />
              </Route>

              <Route path="/project/:projectPathEncoded">
                <Project />
              </Route>

              <Redirect to="/" />
            </Switch>
          </Router>

          <Schedule />
        </ScheduleContext.Provider>
      </StoreContext.Provider>

      <Info />
    </>
  );
};
