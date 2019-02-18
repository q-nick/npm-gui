import * as React from 'react';
import { Button } from '../button/Button';
import * as style from './console.css';

interface Props {
  session: ConsoleSession;
  isFullscreen: boolean;
  onQuitFullScreenSession: () => void;
  onEnterFullScreenSession: (id: string) => void;
  onRemoveSession: (id: string) => void;
  onStopSession: (id: string) => void;
}

export class Session extends React.Component<Props> {
  onEnterFullScreenSession = () => {
    this.props.onEnterFullScreenSession(this.props.session.id);
  }

  onRemoveSession = () => {
    this.props.onRemoveSession(this.props.session.id);
  }

  onStopSession = () => {
    this.props.onStopSession(this.props.session.id);
  }

  getClassNames = (): string => {
    return `
      ${style.session}
      ${this.props.isFullscreen && style.sessionFullscreen}
      ${this.props.session.status === 'CLOSE' && style.sessionClose}
      ${this.props.session.status === 'ERROR' && style.sessionError}
    `;
  }

  render(): React.ReactNode {
    return (
      <div
        key={this.props.session.id}
        className={this.getClassNames()}
      >
        <div className={style.sessionMenu}>
          {
            !this.props.isFullscreen &&
            <Button
              variant="primary"
              scale="small"
              icon="fullscreen-enter"
              onClick={this.onEnterFullScreenSession}
            >Enlarge
            </Button>
          }
          {
            this.props.isFullscreen &&
            <Button
              variant="primary"
              scale="small"
              icon="fullscreen-exit"
              onClick={this.props.onQuitFullScreenSession}
            >Shrink
            </Button>
          }
          {
            this.props.session.status === 'LIVE' &&
            <Button
              variant="danger"
              scale="small"
              icon="x"
              onClick={this.onStopSession}
            >Cancel/Stop
            </Button>
          }
          {
            ['CLOSE', 'ERROR'].includes(this.props.session.status) &&
            <Button
              variant="danger"
              scale="small"
              icon="fullscreen-exit"
              onClick={this.onRemoveSession}
            >remove
            </Button>
          }
        </div>
        <pre className={style.pre}><p>{this.props.session.msg}</p></pre>
      </div>
    );
  }
}
