import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ConsoleStore } from '../stores/console.store';
import { Console } from '../components/console/Console';
import { toJS } from 'mobx';

interface Props {
  consoleStore?: ConsoleStore;
}

@inject('consoleStore') @observer
export class ConsoleContainer extends React.Component<Props> {
  render(): React.ReactNode {
    const sessions = toJS(this.props.consoleStore.sessions);
    return (
      <Console sessions={sessions}/>
    );
  }
}
