import type { VFC } from 'react';
import React from 'react';
import styled from 'styled-components';

import { Button } from '../../ui/Button/Button';
import { Explorer } from './components/Explorer';
import { useHeader } from './use-header';

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
  const { projectPathEncoded, projects, handleRemoveProject } = useHeader();

  return (
    <Nav>
      <LeftSection>
        <Title>npm-gui</Title>

        <Button
          icon="globe"
          navigate="/"
          title="Show global packages"
          variant={projectPathEncoded === 'global' ? 'info' : 'dark'}
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
                navigate={`/${oneOfProjectPathEncoded}`}
                title={window.atob(oneOfProjectPathEncoded)}
                variant={
                  oneOfProjectPathEncoded === projectPathEncoded
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
                title="Remove"
                variant={
                  oneOfProjectPathEncoded === projectPathEncoded
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
