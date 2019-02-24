import * as React from 'react';
import * as style from './info.css';
import axios from 'axios';

interface State {
  content: { __html: string };
}

export class Info extends React.Component<{}, State> {
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
    return <div className={style.info} dangerouslySetInnerHTML={this.state.content} />;
  }
}
