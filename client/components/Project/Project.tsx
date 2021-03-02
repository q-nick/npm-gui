import React, { useContext, useEffect } from 'react';
import {
  Route, Switch, Redirect, useParams,
} from 'react-router-dom';

import styled from 'styled-components';
import { Dependencies } from '../Dependencies/Dependencies';
// import { ScriptsContainer } from '../containers/ScriptsContainer';
// import { Info } from '../Info/Info';
import { Header } from '../Header/Header';
import { Schedule } from '../Schedule/Schedule';
import { StoreContext } from '../../app/StoreContext';

const Row = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

// const LeftColumn = styled.div`
//   flex-basis: 30%;
//   display: flex;
//   padding: 15px;
//   transition: flex-basis 1500ms ease-in-out;
// `;

const RightColumn = styled.div`
  display: flex;
  flex: 1;
  padding: 15px;
  flex-direction: column;
`;

export function Project(): JSX.Element {
  const { projectPathEncoded } = useParams<{ projectPathEncoded: string }>();
  const { projects, addProject } = useContext(StoreContext);
  const scope = projects[projectPathEncoded];

  useEffect(() => {
    if (!scope) {
      addProject(projectPathEncoded);
    }
  }, [projectPathEncoded, addProject, scope]);

  if (!scope) {
    return <></>; // eslint-disable-line
  }

  return (
    <>
      <Header projectPathEncoded={projectPathEncoded} />

      <Row>
        {/* <LeftColumn>
          <ConsoleContainer />
        </LeftColumn> */}

        <RightColumn>
          <Switch>
            <Route path="/project/:projectPathEncoded/dependencies">
              <Dependencies
                // filtersEnabled={['name', 'type']}
                projectPath={projectPathEncoded}
              />
            </Route>

            {/* <Route path="/project/:projectPathEncoded/global">
              <DependenciesContainer filtersEnabled={['name']} />
            </Route> */}

            {/* <Route path="/project/:projectPathEncoded/scripts">
              <ScriptsContainer projectPath={projectPathEncoded} />
            </Route> */}

            <Redirect to={`project/${projectPathEncoded}/dependencies`} />
          </Switch>
        </RightColumn>
      </Row>

      <Schedule />
    </>
  );
}
