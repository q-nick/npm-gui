import type { VFC } from 'react';
import { useContext, useEffect } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { StoreContext } from '../app/StoreContext';
import { Dependencies } from './Dependencies/Dependencies';
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

export const Project: VFC = () => {
  const { projectPathEncoded } = useParams<{ projectPathEncoded: string }>();
  const { projects, addProject } = useContext(StoreContext);
  const scope = projects[projectPathEncoded];

  useEffect(() => {
    if (!scope) {
      addProject(projectPathEncoded);
    }
  }, [projectPathEncoded, addProject, scope]);

  if (!scope) {
    return null;
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
};
