import type { VFC } from 'react';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { ContextStore } from '../app/ContextStore';
import { Dependencies } from './Dependencies/Dependencies';

const Content = styled.div`
  display: flex;
  flex: 1;
  padding: 15px;
  flex-direction: column;
  overflow: hidden;
`;

export const Main: VFC = () => {
  const { projectPathEncoded } = useParams<{ projectPathEncoded?: string }>();
  const projectPathEncodedDefault = projectPathEncoded || 'global';
  const {
    state: { projects },
    dispatch,
  } = useContext(ContextStore);

  const scope = projects[projectPathEncodedDefault];

  useEffect(() => {
    if (!scope) {
      dispatch({
        type: 'addProject',
        projectPath: projectPathEncodedDefault,
      });
    }
  }, [dispatch, projectPathEncodedDefault, scope]);

  if (!scope) {
    return null;
  }

  return (
    <Content>
      <Dependencies projectPath={projectPathEncodedDefault} />
    </Content>
  );
};
