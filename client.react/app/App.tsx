import * as React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import * as style from './app.css';
import { Header, HeaderButton } from '../components/header/Header';
import { Console } from '../components/console/Console';

const buttons: HeaderButton[] = [
  {
    text: 'Global Dependencies',
    routeName: 'global',
    title: '',
  },
  {
    text: 'Project Dependencies',
    routeName: 'dependencies',
    title: '',
  },
  {
    text: 'Scripts',
    routeName: 'scripts',
    title: '',
  },
];

const sessions: any[] = [{ id: 1 }];

export class App extends React.Component {
  render(): React.ReactNode {
    return (
      <>
        <Header buttons={buttons} />
        <div className={style.row}>
          <div className={style.leftColumn}>
            <Console sessions={sessions} />
          </div>
          <div className={style.rightColumn}>
            <Router>
              <Switch>
                <Route exact={true} path={'/'} component={Header} />
                {/* <Route path={'/credit/:id'} component={Credit}/> */}
                {/* <Route exact={true} path={'/profile'} component={User}/> */}
                {/* <Route path={'/dispositions'} component={Disposition}/> */}
              </Switch>
            </Router>
          </div>
        </div>
      </>
    );
  }
}
