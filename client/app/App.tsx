import {
  Route, Switch,
  BrowserRouter as Router,
  Redirect,
} from 'react-router-dom';
import 'open-iconic'; // eslint-disable-line
import { Project } from '../components/Project/Project';
import { StoreContext, useStoreContextValue } from './StoreContext';
import { Header } from '../components/Header/Header';
import { ScheduleContext, useScheduleContextValue } from '../components/Schedule/ScheduleContext';
import { Info } from '../components/Info/Info';

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
                <Header />
                Global
              </Route>
              <Route path="/project/:projectPathEncoded">
                <Project />
              </Route>
              <Redirect to="/" />
            </Switch>
          </Router>
        </ScheduleContext.Provider>
      </StoreContext.Provider>
      <Info />
    </>
  );
}
