import * as React from 'react';
import * as style from './header.css';
import { Button } from '../button/Button';
import { ProjectContainer } from '../../containers/ProjectContainer';
import { Link } from 'react-router-dom';

export interface HeaderButton {
  text: string;
  routeName: string;
  title: string;
}

interface Props {
  buttons: HeaderButton[];
}

export class Header extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <nav className={style.nav}>
        <h1 className={style.h1}>npm-gui</h1>
        {
          this.props.buttons &&
          this.props.buttons
            .map(button =>
              <>
                <Button
                  key={button.routeName}
                  variant="dark"
                >{button.text}
                </Button>
                <Link to={button.routeName}>button.text</Link>
              </>)
        }
        <div className={style.rightSection}>
          <ProjectContainer />
        </div>
      </nav>
    );
  }
}
