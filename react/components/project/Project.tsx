import * as React from 'react';
import * as style from './project.css';
import { Button } from '../button/Button';
import axios from 'axios';

interface Props {
  onSelectPath: Function;
  projectPath: string;
}

interface State {
  isOpen: boolean;
  loading: boolean;
  error: any;
  explorer: {
    ls: Explorer.FileOrFolder[],
    path: string,
  };
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
  }

  componentDidMount(): void {
    this.loadPath('');
  }

  onToggleOpen = (): void => {
    this.setState(prevState => ({ ...prevState, isOpen: !prevState.isOpen }));
  }

  onChangePath = (selectedPath: string): void => {
    this.loadPath(window.btoa(selectedPath));
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
          this.props.onSelectPath(response.data.path);
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
        <p className={style.description}>Current Project path: {this.props.projectPath}</p>
        <Button variant="dark" icon="folder" onClick={this.onToggleOpen} />
        <ul className={`${style.explorer} ${this.state.isOpen && style.explorerOpen}`}>
          <li>
            <button
              className={style.folder}
              onClick={this.onChangePath.bind(this, '../')}
            >../
            </button>
          </li>
          {
            this.state.explorer &&
            this.state.explorer.ls.map((folderOrFile: Explorer.FileOrFolder) => (
              <li key={folderOrFile.name}>
                {
                  folderOrFile.isDirectory && !folderOrFile.isProject &&
                  <button
                    className={style.folder}
                    onClick={this.onChangePath.bind(this, `${this.state.explorer.path}/${folderOrFile.name}`)} // tslint:disable-line
                  >
                    <span className="oi" data-glyph={style.folder} /> {folderOrFile.name}/
                  </button>
                }
                {
                  folderOrFile.isProject &&
                  <button
                    className={style.project}
                    onClick={this.props.onSelectPath.bind(this, this.state.explorer.path)}
                  > <span className="oi" data-glyph="arrow-thick-right" /> {folderOrFile.name}
                  </button >
                }
                {
                  !folderOrFile.isDirectory && !folderOrFile.isProject &&
                  <span className={style.file}>
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
