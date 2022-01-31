import type { VFC } from 'react';
import { useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { StoreContext } from '../../app/StoreContext';
import { Button } from '../../ui/Button/Button';
import { Explorer } from './components/Explorer';

export interface HeaderButton {
  text: string;
  routeName: string;
  icon: string;
}

const Nav = styled.nav`
  background: #3e3f3a;
  min-height: 45px;
  max-height: 45px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  justify-content: space-between;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 1em;
  font-weight: 400;
  margin: 0 15px 0 0;
`;

interface Props {
  projectPathEncoded?: string;
}

export const Header: VFC<Props> = ({ projectPathEncoded }) => {
  const { projects } = useContext(StoreContext);

  const history = useHistory();

  const onSelectPath = useCallback(
    (path: string) => {
      history.push(`/project/${window.btoa(path)}/dependencies`);
    },
    [history],
  );

  return (
    <Nav>
      <LeftSection>
        <Title>npm-gui</Title>

        <Button
          icon="globe"
          key="global"
          onClick={(): void => {
            history.push('/');
          }}
          variant={projectPathEncoded === undefined ? 'info' : 'dark'}
        >
          Global
        </Button>
      </LeftSection>

      <RightSection>
        {Object.keys(projects)
          .filter((p) => p !== 'global')
          .map((oneOfProjectPathEncoded) => (
            <Button
              icon="code"
              key={oneOfProjectPathEncoded}
              lowercase
              onClick={(): void => {
                history.push(
                  `/project/${oneOfProjectPathEncoded}/dependencies`,
                );
              }}
              title={window.atob(oneOfProjectPathEncoded)}
              variant={
                oneOfProjectPathEncoded === projectPathEncoded ? 'info' : 'dark'
              }
            >
              {window.atob(oneOfProjectPathEncoded).split('/').reverse()[0]}
            </Button>
          ))}

        <Explorer onSelectPath={onSelectPath} />
      </RightSection>
    </Nav>
  );
};
