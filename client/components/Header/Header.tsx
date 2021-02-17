import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Button } from '../../ui/Button/Button';
import { Explorer } from './components/Explorer';
import { StoreContext } from '../../app/StoreContext';

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

// const buttons: HeaderButton[] = [
//   // {
//   //   text: 'Global',
//   //   routeName: 'global',
//   //   icon: 'globe',
//   // },
//   {
//     text: 'Project',
//     routeName: 'dependencies',
//     icon: 'code',
//   },
//   // {
//   //   text: 'Scripts',
//   //   routeName: 'scripts',
//   //   icon: 'media-play',
//   // },
// ];

interface Props {
  projectPathEncoded?: string;
}

export function Header({ projectPathEncoded }:Props): JSX.Element {
  const { projects } = useContext(StoreContext);

  const history = useHistory();

  const onSelectPath = useCallback(
    (path:string) => history.push(`/project/${window.btoa(path)}/dependencies`),
    [history],
  );

  return (
    <Nav>
      <LeftSection>
        <Title>npm-gui</Title>
          <Button
            variant={!projectPathEncoded ? "info": 'dark'}
            key="global"
            icon="code"
            onClick={() => history.push(`/`)}
          >
            Global
          </Button>
      </LeftSection>
      <RightSection>
      {Object.keys(projects).map((oneOfProjectPathEncoded) => (
          <Button
            key={oneOfProjectPathEncoded}
            variant={oneOfProjectPathEncoded === projectPathEncoded ? "info": 'dark'}
            icon={'code'}
            onClick={() => history.push(`/project/${oneOfProjectPathEncoded}/dependencies`)}
            lowercase
          >
            {window.atob(oneOfProjectPathEncoded).split('/').reverse()[0]}
          </Button>
        ))}
        <Explorer onSelectPath={onSelectPath} />
      </RightSection>
    </Nav>
  );
}
