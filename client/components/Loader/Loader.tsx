import * as React from 'react';
import * as style from './Loader.css';

export class Loader extends React.PureComponent {
  render(): React.ReactNode {
    return <span className={`oi ${style.spin} ${style.loader}`} data-glyph="reload" />;
  }
}
