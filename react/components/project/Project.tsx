import * as React from 'react';
import * as style from './project.css';
import { Button } from '../button/Button';
import axios from 'axios';

interface Props {
}

interface State {
  isOpen: boolean;
  loading: boolean;
  error: any;
  explorer: any;
}

export class Project extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      loading: false,
      error: false,
      explorer: null,
    };

    this.onSelectPath = this.onSelectPath.bind(this);
  }

  projectPathDecoded(): string {
    return 'path';
    // return this.$route.params.projectPathEncoded
    //   ? window.atob(this.$route.params.projectPathEncoded) : null;
  }

  onToggle(): void {
    this.setState(prevState => ({ ...prevState, isOpen: !prevState.isOpen }));
  }

  onSelectPath(selectedPath: string): void {
    this.loadPath(window.btoa(selectedPath));
  }

  onSelectProjectPath(_: string): void {
    // this.$router.push({ params: { projectPathEncoded: window.btoa(selectedProjectPath) } });
    this.setState(prevState => ({ ...prevState, isOpen: false }));
  }

  loadPath(encodedPath: string): void {
    this.setState(prevState => ({ ...prevState, loading: true }));

    axios
      .get(`/api/explorer/${encodedPath || ''}`)
      .then((response) => {
        this.setState(prevState => ({
          ...prevState,
          loading: false,
          error: false,
          explorer: response.data,
        }));

        if (response.data.changed) {
          this.onSelectProjectPath(response.data.path);
        }
      })
      .catch((error) => {
        this.setState(prevState => ({
          ...prevState,
          error,
          loading: false,
        }));
      });
  }

  render(): React.ReactNode {
    return (
      <div className={style.container}>
        <p className={style.description}>Current Project path: </p>
        <Button variant="dark" icon="folder" />
        <ul
          className="explorer"
        >
          <li>
            <button className="folder" onClick={() => this.onSelectPath('../')}>../</button>
          </li>
          {
            this.state.explorer &&
            this.state.explorer.ls.map((folderOrFile:any) => (
              <li>
                {
                  folderOrFile.isDirectory && !folderOrFile.isProject &&
                  <button className="folder">
                    <span className="oi" data-glyph="folder" /> {folderOrFile.name}/
                  </button>
                }
                {
                  folderOrFile.isProject &&
                  <button
                    className="project"
                    onClick={() => this.onSelectPath(this.state.explorer.path)}
                  > <span className="oi" data-glyph="arrow-thick-right" /> {folderOrFile.name}
                  </button >
                }
                {
                  !folderOrFile.isDirectory && !folderOrFile.isProject &&
                  <span className="file">
                    <span className="oi" data-glyph="file" /> {folderOrFile.name}
                  </span>
                }
              </li >
            ))
          }
        </ul >
      </div >
    );
  }
}
