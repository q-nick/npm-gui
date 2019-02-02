import * as React from 'react';
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';

import * as style from './app.css';
import { Header, HeaderButton } from '../components/header/Header';
import { ConsoleContainer } from '../containers/ConsoleContainer';
import 'open-iconic';
import { ProjectDependenciesContainer } from '../containers/ProjectDependenciesContainer';
import { GlobalDependenciesContainer } from '../containers/GlobalDependenciesContainer';
import { Info } from '../components/info/Info';

const buttonsBase: HeaderButton[] = [
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

function renderChildRoutes({ match }: RouteComponentProps): React.ReactNode {
  if (!match) return '';

  return (
    <Switch>
      <Route
        exact={true}
        path={`${match.path}/dependencies`}
        component={ProjectDependenciesContainer}
      />
      <Route
        exact={true}
        path={`${match.path}/global`}
        component={GlobalDependenciesContainer}
      />
      <Redirect to={`${match.path}/dependencies`} />
    </Switch>
  );
}

export class AppBase extends React.Component<RouteComponentProps> {
  render(): React.ReactNode {
    console.log(this.props.match)
    const buttons = buttonsBase.map(button => ({
      ...button,
      routeName: `${this.props.match.path}/${button.routeName}`,
    }));

    return (
      <>
        <Header buttons={buttons} />
        <div className={style.row}>
          <div className={style.leftColumn}>
            <ConsoleContainer />
          </div>
          <div className={style.rightColumn}>
            <Route
              path={'/project/:projectPathEncoded'}
              children={renderChildRoutes}
            />
            <Info />
          </div>
        </div>
      </>
    );
  }
}

export const App = withRouter(AppBase); // tslint:disable-line
