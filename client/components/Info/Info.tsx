import * as React from 'react';
import * as style from './Info.css';
import axios from 'axios';

interface State {
  content: { __html: string };
}

export class Info extends React.PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      content: { __html: '' },
    };
  }

  componentDidMount(): void {
    axios
      .get('/api/info')
      .then((response) => {
        // tricky one
        setTimeout(() => {
          if ((window as any).GithubApi) {
            this.setState(prevState => ({ ...prevState, content: { __html: response.data } }));
            (window as any).GithubApi.render();
          }
        });
      });
  }

  render(): React.ReactNode {
    return (
      <div
        className={this.state.content.__html ? style.info : ''}
        dangerouslySetInnerHTML={this.state.content}
      />
    );
  }
}
