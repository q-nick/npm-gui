import * as React from 'react';
import * as style from './button.css';

interface Props {
  variant: 'dark';
  icon?: string;
}

export class Button extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <button
        className={`${style[this.props.variant]} ${style.button}`}
      >
        {this.props.icon && <span className="oi" data-glyph={this.props.icon} />}
        {this.props.children}
      </button>
    );
  }
}
