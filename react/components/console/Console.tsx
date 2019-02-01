import * as React from 'react';
import * as style from './console.css';

interface Props {
  sessions: ConsoleSession[];
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

  getSessionClassNames(session: ConsoleSession): string {
    return `
      ${style.session}
      ${session.id === this.state.fullScreenSessionId && style.sessionFullscreen}
      ${session.status === 'CLOSE' && style.sessionClose}
      ${session.status === 'ERROR' && style.sessionError}
    `;
  }

  render(): React.ReactNode {
    return (
      <div className={style.console}>
        <header>
          <p><span className="oi" data-glyph="terminal" /> Console</p>
        </header>
        {
          this.props.sessions &&
          this.props.sessions.map(session => (
            <div
              key={session.id}
              className={this.getSessionClassNames(session)}
            >
              <div className={style.sessionMenu}>
                TODO
                </div>
              <pre className={style.pre}><p>{session.msg}</p></pre>
            </div>))
        }
      </div>
    );
  }
}
