import * as React from 'react';
import * as style from './console.css';
import { Session } from './Session';

interface Props {
  sessions: NpmGui.ConsoleSession[];
  onRemoveSession: (id: string) => void;
  onStopSession: (id: string) => void;
}

interface State {
  fullScreenSessionId: string;
}

export class Console extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fullScreenSessionId: null,
    };
  }

  onEnterFullScreenSession = (id: string): void => {
    this.setState(prevState => ({ ...prevState, fullScreenSessionId: id }));
  }

  onQuitFullScreenSession = (): void => {
    this.setState(prevState => ({ ...prevState, fullScreenSessionId: null }));
  }

  render(): React.ReactNode {
    return (
      <div className={style.console}>
        <header>
          <p><span className="oi" data-glyph="terminal" /> Console</p>
        </header>
        {
          this.props.sessions &&
          this.props.sessions.map(session =>
            (
              <Session
                key={session.id}
                session={session}
                onEnterFullScreenSession={this.onEnterFullScreenSession}
                onQuitFullScreenSession={this.onQuitFullScreenSession}
                onRemoveSession={this.props.onRemoveSession}
                onStopSession={this.props.onStopSession}
                isFullscreen={this.state.fullScreenSessionId === session.id}
              />
            ),
          )
        }
      </div>
    );
  }
}
