import * as React from 'react';
import * as style from './Search.css';
import { Button } from '../Button/Button';
import { Loader } from '../Loader/Loader';

interface Props {
  searchResults: Dependency.SearchResult[];
  types: Dependency.Type[];
  onSearch: (query: string, repo: Dependency.Repo) => void;
  onInstall: (repo: Dependency.Repo, dependency: Dependency.Basic, type: Dependency.Type) => void;
}

interface State {
  isOpen: boolean;
  query: string;
  repo: Dependency.Repo;
}

export class Search extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      query: '',
      repo: 'npm',
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ query: event.target.value });
  }

  onSubmit = (event: any): void => {
    event.preventDefault();
    this.props.onSearch(this.state.query, this.state.repo);
  }

  onToggleOpen = (): void => {
    this.setState(prevState => ({ ...prevState, isOpen: !prevState.isOpen }));
  }

  onInstall = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const name = (event.target as HTMLButtonElement).getAttribute('data-name');
    const type = (event.target as HTMLButtonElement).getAttribute('data-type') as Dependency.Type;

    const result:Dependency.SearchResult = this.props.searchResults.find(r => r.name === name);

    this.props.onInstall(this.state.repo, { name: result.name, version: result.version }, type);

    this.setState(prevState => ({ ...prevState, isOpen: false }));
  }

  renderForm(): React.ReactNode {
    return (
      <form className={style.form} onSubmitCapture={this.onSubmit}>
        <select disabled={this.props.searchResults === undefined}>
          <option value="npm">npm</option>
          <option value="bower">bower</option>
        </select>&nbsp;
        <input
          type="text"
          placeholder="type name"
          disabled={this.props.searchResults === undefined}
          value={this.state.query}
          onChange={this.handleChange}
        />&nbsp;
        <Button
          variant="success"
          disabled={this.props.searchResults === undefined}
          type="submit"
          scale="small"
        >{this.props.searchResults === undefined ? <Loader /> : 'search'}
        </Button>
      </form>
    );
  }

  renderResults(): React.ReactNode {
    return (
      <table>
        <tbody>
          <tr>
            <th>score</th>
            <th>name</th>
            <th>version</th>
            <th>github</th>
            <th>install</th>
          </tr>
          {
            this.props.searchResults &&
            this.props.searchResults.map(result => (
              <tr key={result.name}>
                <td className={style.td}>{(result.score * 100).toFixed(2)}%</td>
                <td className={style.td}>
                  <strong>{result.name}</strong>
                </td>
                <td className={style.td}>{result.version}</td>
                <td className={style.td}>
                  <a target="_blank">show repo</a>
                </td>
                <td className={style.td}>
                  {
                    this.props.types.map(type => (
                      <Button
                        key={`${result.name}${type}`}
                        variant="info"
                        scale="small"
                        data-name={result.name}
                        data-type={type}
                        onClick={this.onInstall}
                      >{type}
                      </Button>
                    ))
                  }
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }

  render(): React.ReactNode {
    return (
      <div className={`${style.search} ${this.state.isOpen && style.searchOpen}`}>
        <Button
          variant="primary"
          scale="small"
          icon="plus"
          onClick={this.onToggleOpen}
        >Search / Add
        </Button>
        {this.renderForm()}
        <div className={style.tableContainer}>
          {this.props.searchResults && this.props.searchResults.length ? this.renderResults() : ''}
        </div>
      </div>
    );
  }
}
