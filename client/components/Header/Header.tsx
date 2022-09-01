import type { VFC } from 'react';
import { useCallback, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { ContextStore } from '../../app/ContextStore';
import { Button } from '../../ui/Button/Button';
import { Explorer } from './components/Explorer';

export interface HeaderButton {
  text: string;
  routeName: string;
  icon: string;
}

const Nav = styled.nav`
  background: #3e3f3a;
  min-height: 35px;
  max-height: 35px;
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

const CloseButton = styled(Button)`
  margin-right: 15px;
  margin-left: -3px;
`;

export const Header: VFC = () => {
  const { projectPathEncoded } = useParams<{ projectPathEncoded?: string }>();
  const projectPathEncodedDefault = projectPathEncoded || 'global';

  const {
    state: { projects },
  } = useContext(ContextStore);

  const history = useHistory();

  const onSelectPath = useCallback(
    (path: string) => {
      history.push(`/${window.btoa(path)}`);
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
          scale="small"
          variant={projectPathEncodedDefault === 'global' ? 'info' : 'dark'}
        >
          Global
        </Button>
      </LeftSection>

      <RightSection>
        {Object.keys(projects)
          .filter((p) => p !== 'global')
          .map((oneOfProjectPathEncoded) => (
            <>
              <Button
                icon="code"
                key={oneOfProjectPathEncoded}
                lowercase
                onClick={(): void => {
                  history.push(`/${oneOfProjectPathEncoded}`);
                }}
                scale="small"
                title={window.atob(oneOfProjectPathEncoded)}
                variant={
                  oneOfProjectPathEncoded === projectPathEncodedDefault
                    ? 'info'
                    : 'dark'
                }
              >
                {window.atob(oneOfProjectPathEncoded).split('/').reverse()[0]}
              </Button>
              <CloseButton
                icon="x"
                scale="small"
                variant={
                  oneOfProjectPathEncoded === projectPathEncodedDefault
                    ? 'info'
                    : 'dark'
                }
              />
            </>
          ))}

        <Explorer onSelectPath={onSelectPath} />
      </RightSection>
    </Nav>
  );
};
