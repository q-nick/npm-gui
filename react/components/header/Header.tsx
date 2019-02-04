import * as React from 'react';
import * as style from './header.css';
import { Button } from '../button/Button';
import { ProjectContainer } from '../../containers/ProjectContainer';

export interface HeaderButton {
  text: string;
  routeName: string;
  title: string;
  icon: string;
}

export interface Props {
  buttons: HeaderButton[];
  onClickRoute: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, routeName: string) => void;
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
              <Button
                key={button.routeName}
                variant="dark"
                icon={button.icon}
                payload={button.routeName}
                onClickPayload={this.props.onClickRoute}
              >{button.text}
              </Button>)
        }
        <div className={style.rightSection}>
          <ProjectContainer />
        </div>
      </nav>
    );
  }
}
