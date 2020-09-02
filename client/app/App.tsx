import * as React from 'react';
import {
  Route, Switch, Redirect, useParams,
} from 'react-router-dom';
import 'open-iconic';

import styled from 'styled-components';
import { ConsoleContainer } from '../containers/ConsoleContainer';
import { DependenciesContainer } from '../containers/DependenciesContainer';
// import { ScriptsContainer } from '../containers/ScriptsContainer';
import { Info } from '../components/Info/Info';
import { Header } from '../components/Header/Header';

const Row = styled.div`
  flex: 1;
  display: flex;
`;

const LeftColumn = styled.div`
  flex-basis: 30%;
  display: flex;
  padding: 15px;
  transition: flex-basis 1500ms ease-in-out;
`;

const RightColumn = styled.div`
  display: flex;
  flex: 1;
  padding: 15px;
  flex-direction: column;
`;

export function App(): JSX.Element {
  const { projectPathEncoded } = useParams<{projectPathEncoded:string}>();

  return (
    <>
      <Header projectPathEncoded={projectPathEncoded} />
      <Row>
        <LeftColumn>
          <ConsoleContainer />
        </LeftColumn>
        <RightColumn>
          <Switch>
            <Route path="/project/:projectPathEncoded/dependencies">
              <DependenciesContainer
                projectPath={projectPathEncoded}
                filtersEnabled={['name', 'type']}
              />
            </Route>
            <Route path="/project/:projectPathEncoded/global">
              <DependenciesContainer filtersEnabled={['name']} />
            </Route>
            {/* <Route path="/project/:projectPathEncoded/scripts">
              <ScriptsContainer projectPath={projectPathEncoded} />
            </Route> */}
            <Redirect to={`project/${projectPathEncoded}/dependencies`} />
          </Switch>
          <Info />
        </RightColumn>
      </Row>
    </>
  );
}
