import * as React from 'react';
import { ConsoleStore } from '../stores/console.store';
import { withRouter, RouteComponentProps } from 'react-router';
import { Header, HeaderButton } from '../components/header/Header';

interface Props {
  consoleStore?: ConsoleStore;
}

const buttons: HeaderButton[] = [
  {
    text: 'Global Dependencies',
    routeName: 'global',
    title: '',
    icon: 'globe',
  },
  {
    text: 'Project Dependencies',
    routeName: 'dependencies',
    title: '',
    icon: 'code',
  },
  {
    text: 'Scripts',
    routeName: 'scripts',
    title: '',
    icon: 'media-play',
  },
];

class HeaderContainerBase extends React.Component<Props & RouteComponentProps> {
  onClickRoute = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, routeName: string): void => {
    this.props.history.push(`${this.props.match.url}/${routeName}`);
  }

  render(): React.ReactNode {
    return (
      <Header onClickRoute={this.onClickRoute} buttons={buttons} />
    );
  }
}

export const HeaderContainer = withRouter(HeaderContainerBase); //tslint:disable-line
