import * as React from 'react';
import * as style from './search.css';
import { Button } from '../button/Button';
import { Loader } from '../loader/Loader';

interface Props {
  searchQuery: string;
  searchResults: any[];
}

interface State {
  isOpen: boolean;
}

export class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }
  render(): React.ReactNode {
    return (
      <div className={`${style.search} ${this.state.isOpen && style.searchOpen}`}>
        <Button variant="primary" scale="small" icon="plus">Search / Add</Button>
        <form className={style.form}>
          <select disabled={this.props.searchResults === undefined}>
            <option value="npm">npm</option>
            <option value="bower">bower</option>
          </select>
          <input
            type="text"
            placeholder="type name"
            disabled={this.props.searchResults === undefined}
          />
          <Button variant="success" disabled={this.props.searchResults === undefined}>
            {this.props.searchResults === undefined ? <Loader /> : 'search'}
          </Button>
        </form>
        <div className={style.tableContainer}>
          {
            this.props.searchResults.length &&
            <table>
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
                    <td>{(result.score * 100).toFixed(2)}%</td>
                    <td>
                      <strong>{result.name}</strong>
                    </td>
                    <td>{result.version}</td>
                    <td>
                      <a target="_blank">show repo</a>
                    </td>
                    <td>
                      <Button variant="info" scale="small">install prod</Button>
                      <Button variant="info" scale="small">install dev</Button>
                    </td>
                  </tr>
                ))}
            </table>
          }
        </div>
      </div>
    );
  }
}
