import type { VFC } from 'react';
import { useContext, useEffect } from 'react';
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

export const Global: VFC = () => {
  const { projects, addProject } = useContext(StoreContext);
  const scope = projects['global'];
  useEffect(() => {
    if (!scope) {
      addProject('global');
    }
  }, [addProject, scope]);

  if (!scope) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
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
};
