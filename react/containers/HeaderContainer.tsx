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
  },
  {
    text: 'Project Dependencies',
    routeName: 'dependencies',
    title: '',
  },
  {
    text: 'Scripts',
    routeName: 'scripts',
    title: '',
  },
];

class HeaderContainerBase extends React.Component<Props & RouteComponentProps> {
  constructor(props: Props & RouteComponentProps) {
    super(props);

    this.onClickRoute = this.onClickRoute.bind(this);
  }

  componentDidMount(): void {
    console.log('header did mount');
  }

  onClickRoute(_: React.MouseEvent<HTMLButtonElement, MouseEvent>, routeName: string): void {
    console.log(routeName, `${this.props.match.url}/${routeName}`);
    this.props.history.push(`${this.props.match.url}/${routeName}`);
  }

  render(): React.ReactNode {
    return (
      <Header onClickRoute={this.onClickRoute} buttons={buttons} />
    );
  }
}

export const HeaderContainer = withRouter(HeaderContainerBase); //tslint:disable-line
