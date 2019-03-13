import * as React from 'react';
import * as style from './Button.css';

// export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'dark' | 'primary' | 'warning' | 'danger' | 'success' | 'info';
  icon?: string;
  scale?: 'small';
}

export class Button extends React.PureComponent<Props> {
  getIconClass():string {
    return `oi ${style.oi} ${!this.props.children ? style.oiLonely : ''}`;
  }

  render(): React.ReactNode {
    return (
      <button
        {...this.props}
        className={`${this.props.className} ${style.button} ${style[this.props.variant]} ${style[this.props.scale]} `} //tslint:disable-line
      >
        {this.props.icon && <span className={this.getIconClass()} data-glyph={this.props.icon} />}
        {this.props.children}
      </button>
    );
  }
}
