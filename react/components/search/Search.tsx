import * as React from 'react';
import * as style from './search.css';
import { Button } from '../button/Button';
import { Loader } from '../loader/Loader';

interface Props {
  searchResults: any[];
  onSearch: (query: string, repo: Dependency.Repo) => void;
}

interface State {
  isOpen: boolean;
  query: string;
  repo: Dependency.Repo;
}

export class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      query: '',
      repo: 'npm',
    };

    this.onToggleOpen = this.onToggleOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ query: event.target.value });
  }

  onSubmit(event: any): void {
    event.preventDefault();
    this.props.onSearch(this.state.query, this.state.repo);
  }

  onToggleOpen(): void {
    this.setState(prevState => ({ ...prevState, isOpen: !prevState.isOpen }));
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
            <th>action</th>
          </tr>
          {
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
                  <Button variant="info" scale="small">install prod</Button>
                  <Button variant="info" scale="small">install dev</Button>
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
          {this.props.searchResults.length ? this.renderResults() : ''}
        </div>
      </div>
    );
  }
}
