import { useCallback, useContext } from 'react';
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

interface Props {
  projectPathEncoded?: string;
}

export function Header({ projectPathEncoded }: Props): JSX.Element {
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
          key="global"
          icon="code"
          onClick={(): void => {
            history.push('/');
          }}
          variant={projectPathEncoded === undefined ? 'info' : 'dark'}
        >
          Global
        </Button>
      </LeftSection>

      <RightSection>
        {Object.keys(projects).map((oneOfProjectPathEncoded) => (
          <Button
            key={oneOfProjectPathEncoded}
            icon="code"
            lowercase
            onClick={(): void => {
              history.push(`/project/${oneOfProjectPathEncoded}/dependencies`);
            }}
            variant={oneOfProjectPathEncoded === projectPathEncoded ? 'info' : 'dark'}
          >
            {window.atob(oneOfProjectPathEncoded).split('/').reverse()[0]}
          </Button>
        ))}

        <Explorer onSelectPath={onSelectPath} />
      </RightSection>
    </Nav>
  );
}
