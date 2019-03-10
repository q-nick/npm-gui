import * as React from 'react';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';

import * as style from './app.css';
import { ConsoleContainer } from '../containers/ConsoleContainer';
import 'open-iconic';
import { DependenciesContainer } from '../containers/DependenciesContainer';
import { ScriptsContainer } from '../containers/ScriptsContainer';
import { Info } from '../components/info/Info';
import { HeaderContainer } from '../containers/HeaderContainer';

export class App extends React.Component<RouteComponentProps> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.renderRouteProjectDependencies = this.renderRouteProjectDependencies.bind(this);
    this.renderRouteScripts = this.renderRouteScripts.bind(this);
  }

  renderRouteProjectDependencies(): React.ReactNode {
    const projectPath = (this.props.match.params as any).projectPathEncoded;
    return <DependenciesContainer projectPath={projectPath} />;
  }

  renderRouteGlobalDependencies() :React.ReactNode {
    return <DependenciesContainer />;
  }

  renderRouteScripts() :React.ReactNode {
    const projectPath = (this.props.match.params as any).projectPathEncoded;
    return <ScriptsContainer projectPath={projectPath} />;
  }

  render(): React.ReactNode {
    return (
      <>
        <HeaderContainer />
        <div className={style.row}>
          <div className={style.leftColumn}>
            <ConsoleContainer />
          </div>
          <div className={style.rightColumn}>
            <Switch>
              <Route
                path={`${this.props.match.path}/dependencies`}
                key={`${this.props.match.url}/dependencies`}
                render={this.renderRouteProjectDependencies}
              />
              <Route
                path={`${this.props.match.path}/global`}
                key={'global'}
                render={this.renderRouteGlobalDependencies}
              />
              <Route
                path={`${this.props.match.path}/scripts`}
                key={`${this.props.match.url}/scripts`}
                render={this.renderRouteScripts}
              />
              <Redirect to={`${this.props.match.url}/dependencies`} />
            </Switch>
            {/* <Info /> */}
          </div>
        </div>
      </>
    );
  }
}
