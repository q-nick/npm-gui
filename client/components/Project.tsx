import { useContext, useEffect } from 'react';
import {
  Route, Switch, Redirect, useParams,
} from 'react-router-dom';

import styled from 'styled-components';
import { Dependencies } from './Dependencies/Dependencies';
import { StoreContext } from '../app/StoreContext';
import { Header } from './Header/Header';

const Row = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

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
        <RightColumn>
          <Switch>
            <Route path="/project/:projectPathEncoded/dependencies">
              <Dependencies
                // filtersEnabled={['name', 'type']}
                projectPath={projectPathEncoded}
              />
            </Route>

            <Redirect to={`project/${projectPathEncoded}/dependencies`} />
          </Switch>
        </RightColumn>
      </Row>
    </>
  );
}
