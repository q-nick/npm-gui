import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ConsoleStore } from '../stores/console.store';
import { Console } from '../components/Console/Console';
import { toJS } from 'mobx';

interface Props {
  consoleStore?: ConsoleStore;
}

@inject('consoleStore') @observer
export class ConsoleContainer extends React.Component<Props> {
  onRemoveSession = (id: string): void => {
    this.props.consoleStore.removeSession(id);
  }

  onStopSession = (_: string): void => {
    // TODO
    // this.props.consoleStore.removeSession(id);
  }

  render(): React.ReactNode {
    const sessions = toJS(this.props.consoleStore.sessions);
    return (
      <Console
        sessions={sessions}
        onRemoveSession={this.onRemoveSession}
        onStopSession={this.onStopSession}
      />
    );
  }
}
