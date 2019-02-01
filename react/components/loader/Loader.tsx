import * as React from 'react';
import * as style from './loader.css';

export class Loader extends React.Component {
  render(): React.ReactNode {
    return <span className={`oi ${style.spin} ${style.loader}`} data-glyph="reload" />;
  }
}
