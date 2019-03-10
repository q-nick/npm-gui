import * as React from 'react';
import * as style from './button.css';

type Props = {
  variant: 'dark' | 'primary' | 'warning' | 'danger' | 'success' | 'info';
  icon?: string;
  scale?: 'small';
};

export class Button extends React.Component<Props & React.HTMLProps<HTMLButtonElement>> {
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
