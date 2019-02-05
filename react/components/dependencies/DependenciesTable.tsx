import * as React from 'react';
import * as style from './dependencies.css';
import { ThSortable } from '../th-sortable/ThSortable';
import { DependencyRow } from './DependencyRow';

interface Props {
  sortMatch: string;
  sortKey: string;
  sortReversed: boolean;
  dependencies: Dependency.Entire[];
  dependenciesLoading: any;
  onDeleteDependency: (dependency: Dependency.Entire) => void;
  onInstallDependencyVersion: (dependency: Dependency.Entire, version: string) => void;
}

export class DependenciesTable extends React.Component<Props> {
  renderThs(): React.ReactNode {
    const ths = [
      { name: 'Env', sortMatch: 'env' },
      { name: 'Name', sortMatch: 'name' },
      { name: 'Nsp' },
      { name: 'Required', sortMatch: 'required', className: style.columnVersion },
      { name: 'Installed', sortMatch: 'installed', className: style.columnVersion },
      { name: 'Wanted', sortMatch: 'wanted', className: style.columnVersion },
      { name: 'Latest', sortMatch: 'latest', className: style.columnVersion },
      { name: 'Action' },
    ];

    return (ths.map(th => (
      <React.Fragment key={th.name}>
        {
          th.sortMatch ?
            <ThSortable
              className={th.className}
              sortMatch={th.sortMatch}
              sortKey={this.props.sortKey}
              sortReversed={this.props.sortReversed}
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
        <table v-show="!loading">
          <thead>
            <tr>
              {this.renderThs()}
            </tr>
          </thead>
          <tbody>
            {
              this.props.dependencies &&
              this.props.dependencies.map(dependency =>
                <DependencyRow
                  key={dependency.name}
                  dependency={dependency}
                  dependenciesLoading={this.props.dependenciesLoading}
                  onDeleteDependency={this.props.onDeleteDependency}
                  onInstallDependencyVersion={this.props.onInstallDependencyVersion}
                />)
            }
          </tbody>
        </table>
      </div>
    );
  }
}
