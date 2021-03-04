import {
  Route, Switch,
  BrowserRouter as Router,
  Redirect,
} from 'react-router-dom';
import 'open-iconic/font/css/open-iconic.css';
import { Project } from '../components/Project';
import { Global } from '../components/Global';
import { StoreContext, useStoreContextValue } from './StoreContext';
import { ScheduleContext, useScheduleContextValue } from '../components/Schedule/ScheduleContext';
import { Info } from '../components/Info';
import { Schedule } from '../components/Schedule/Schedule';

export function App(): JSX.Element {
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
}
