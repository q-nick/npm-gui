import type { VFC } from 'react';
import React, { useContext } from 'react';
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
    dispatch,
  } = useContext(ContextStore);

  const history = useHistory();

  const handleRemoveProject = (projectPath: string): void => {
    history.push(`/`);
    dispatch({ type: 'removeProject', projectPath });
  };

  return (
    <Nav>
      <LeftSection>
        <Title>npm-gui</Title>

        <Button
          icon="globe"
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
        {projects
          .filter((p) => p !== 'global')
          .map((oneOfProjectPathEncoded) => (
            <React.Fragment key={oneOfProjectPathEncoded}>
              <Button
                icon="code"
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
                onClick={(): void =>
                  handleRemoveProject(oneOfProjectPathEncoded)
                }
                scale="small"
                variant={
                  oneOfProjectPathEncoded === projectPathEncodedDefault
                    ? 'info'
                    : 'dark'
                }
              />
            </React.Fragment>
          ))}

        <Explorer />
      </RightSection>
    </Nav>
  );
};
