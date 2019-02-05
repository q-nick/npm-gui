import * as React from 'react';
import * as style from './button.css';

type Props = {
  variant: 'dark' | 'primary' | 'warning' | 'danger' | 'success' | 'info';
  icon?: string;
  scale?: 'small';
  payload?: any;
  onClickPayload?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, payload: any) => void;
};

export class Button extends React.Component<Props & React.HTMLProps<HTMLButtonElement>> {
  onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    if (this.props.payload) {
      this.props.onClickPayload(event, this.props.payload);
    } else if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render(): React.ReactNode {
    const { onClickPayload, ...propsToUse } = this.props;
    return (
      <button
        {...propsToUse}
        onClick={this.onClick}
        className={`${this.props.className} ${style.button} ${style[this.props.variant]} ${style[this.props.scale]} `} //tslint:disable-line
      >
        {this.props.icon && <span className={`oi ${style.oi}`} data-glyph={this.props.icon} />}
        {this.props.children}
      </button>
    );
  }
}
