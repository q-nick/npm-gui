import * as React from 'react';
import * as style from './ConfirmButton.css';
import { Button, Props } from '../Button/Button';

interface State {
  countdown: number;
  intervalId: number;
}

export class ConfirmButton extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      countdown: 0,
      intervalId: null,
    };

    this.onStartClick = this.onStartClick.bind(this);
    this.onConfirmClick = this.onConfirmClick.bind(this);
    this.onTick = this.onTick.bind(this);
  }

  onTick(): void {
    if (this.state.countdown !== 0) {
      this.setState(state => ({ countdown: state.countdown - 1 }));
    } else {
      clearInterval(this.state.intervalId);
    }
  }

  onStartClick(): void {
    setTimeout(() => this.setState({ countdown: 5 }), 300);

    clearInterval(this.state.intervalId);
    const intervalId = window.setInterval(this.onTick, 1000);
    this.setState({ intervalId });
  }

  onConfirmClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.stopPropagation();

    if (this.state.countdown) {
      clearInterval(this.state.intervalId);
      this.props.onClick(event);
    }
  }

  render(): React.ReactNode {
    return (
      <div className={style.container}>
        <Button
          {...this.props}
          onClick={this.onStartClick}
          className={style.startButton}
        />
        {
          !!this.state.countdown &&
          <Button
            {...this.props}
            onClick={this.onConfirmClick}
            className={style.confirmButton}
          >
            {`confirm (${this.state.countdown})`}
          </Button>
        }
      </div>
    );
  }
}
