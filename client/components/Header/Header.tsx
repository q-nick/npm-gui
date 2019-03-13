import * as React from 'react';
import * as style from './Header.css';
import { Button } from '../Button/Button';
import { ProjectContainer } from '../../containers/ProjectContainer';

export interface HeaderButton {
  text: string;
  routeName: string;
  title: string;
  icon: string;
}

export interface Props {
  buttons: HeaderButton[];
  onClickRoute: (routeName: string) => void;
}

export class Header extends React.PureComponent<Props> {
  onClickRoute = (event: React.MouseEvent<HTMLButtonElement>):void => {
    const routeName = (event.target as HTMLButtonElement).getAttribute('data-route');
    this.props.onClickRoute(routeName);
  }

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
                data-route={button.routeName}
                onClick={this.onClickRoute}
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
