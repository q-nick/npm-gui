import { useContext, useEffect } from 'react';

import styled from 'styled-components';
import { Dependencies } from './Dependencies/Dependencies';
import { Header } from './Header/Header';
import { StoreContext } from '../app/StoreContext';

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

export function Global(): JSX.Element {
  const { projects, addProject } = useContext(StoreContext);
  const scope = projects.global;

  useEffect(() => {
    if (!scope) {
      addProject('global');
    }
  }, [addProject, scope]);

  if (!scope) {
    return <></>; // eslint-disable-line
  }

  return (
    <>
      <Header />

      <Row>

        <RightColumn>
          <Dependencies projectPath="global" />
        </RightColumn>
      </Row>
    </>
  );
}
