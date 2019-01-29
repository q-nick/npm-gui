import * as React from 'react';
import * as style from './console.css';

interface Props {
  sessions: any[];
}

export class Console extends React.Component<Props> {
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
              className={style.session}
            // v-bind: class="{
            //   'session--fullscreen': id === fullScreenSessionId,
            //   'session--new': session.status === 'NEW',
            //   'session--open': session.status === 'OPEN',
            //   'session--close': session.status === 'CLOSE',
            //   'session--error': session.status === 'ERROR',
            // }"
            >
              <div className="session__menu">
                TODO
                </div>
              <pre><p>{session.msg}</p></pre>
            </div>))
        }
      </div>
    );
  }
}
