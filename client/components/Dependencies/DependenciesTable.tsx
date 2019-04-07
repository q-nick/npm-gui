import * as React from 'react';
import * as style from './Dependencies.css';
import { ThSortable } from '../ThSortable/ThSortable';
import { DependencyRow } from './DependencyRow';
import { Loader } from '../Loader/Loader';

interface Props {
  sortKey: string;
  sortReversed: boolean;
  filters: { [key:string] : string };
  filtersEnabled?: ('name' | 'type')[];
  dependencies: Dependency.Entire[];
  dependenciesProcessing: any;
  onDeleteDependency: (dependency: Dependency.Entire) => void;
  onInstallDependencyVersion: (dependency: Dependency.Entire, version: string) => void;
  onSortChange: (sortKey: string) => void;
  onFilterChange: (filterName: string, filterValue: string) => void;
}

export class DependenciesTable extends React.PureComponent<Props> {
  isLoading(): boolean {
    return !this.props.dependencies;
  }

  isEmpty(): boolean {
    return this.props.dependencies && this.props.dependencies.length === 0;
  }

  renderThs(): React.ReactNode {
    const ths = [
      {
        name: 'Env', sortMatch: 'type', className: style.columnEnv,
        filter: this.props.filtersEnabled.includes('type') && {
          type: 'select',
          value: this.props.filters['type'],
          options: ['dev', 'prod'],
        },
      },
      {
        name: 'Name', sortMatch: 'name', className: style.columnName,
        filter: {
          type: 'text', value: this.props.filters['name'],
        },
      },
      // { name: 'Nsp' },
      { name: 'Required', sortMatch: 'required', className: style.columnVersion },
      { name: 'Installed', sortMatch: 'installed', className: style.columnVersion },
      { name: 'Wanted', sortMatch: 'wanted', className: style.columnVersion },
      { name: 'Latest', sortMatch: 'latest', className: style.columnVersion },
      { name: '', className: style.columnAction },
    ];

    return (ths.map(th => (
      <React.Fragment key={th.name}>
        {
          th.sortMatch ?
            <ThSortable
              className={th.className}
              filter={th.filter as any}
              sortMatch={th.sortMatch}
              sortKey={this.props.sortKey}
              sortReversed={this.props.sortReversed}
              onSortChange={this.props.onSortChange}
              onFilterChange={this.props.onFilterChange}
            >{th.name}
            </ThSortable>
            :
            <th className={th.className}>{th.name}</th>
        }
      </React.Fragment>
    )));
  }

  render(): React.ReactNode {
    return (
      <div className={style.tableContainer}>
        <div className={style.infoContainer}>
          {this.isEmpty() && <>empty...</>}
          {this.isLoading() && <><Loader />&nbsp;loading...</>}
        </div>
        <table>
          <thead>
            <tr>
              {this.renderThs()}
            </tr>
          </thead>
          <tbody>
            {
              this.props.dependencies &&
              this.props.dependencies.map(dependency =>
                (
                  <DependencyRow
                    key={dependency.name}
                    dependency={dependency}
                    isProcessing={this.props.dependenciesProcessing[dependency.name]}
                    onDeleteDependency={this.props.onDeleteDependency}
                    onInstallDependencyVersion={this.props.onInstallDependencyVersion}
                  />
                ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}
