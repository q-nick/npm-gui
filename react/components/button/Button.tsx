import * as React from 'react';
import * as style from './button.css';

interface Props {
  variant: 'dark' | 'primary' | 'warning' | 'danger' | 'success' | 'info';
  icon?: string;
  scale?: 'small';
}

export class Button extends React.Component<Props & React.HTMLProps<HTMLButtonElement>> {
  render(): React.ReactNode {
    return (
      <button
        className={`${style.button} ${style[this.props.variant]} ${style[this.props.scale]}`}
        {...this.props}
      >
        {this.props.icon && <span className={`oi ${style.oi}`} data-glyph={this.props.icon} />}
        {this.props.children}
      </button>
    );
  }
}
