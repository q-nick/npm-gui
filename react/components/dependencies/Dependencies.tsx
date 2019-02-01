import * as React from 'react';
import * as style from './dependencies.css';
import { Button } from '../button/Button';
import { ThSortable } from '../th-sortable/ThSortable';
import { Loader } from '../loader/Loader';
import { SearchContainer } from '../../containers/SearchContainer';

interface Props {
  sortMatch: string;
  sortKey: string;
  sortReversed: boolean;
  dependencies: Dependency.Entire[];
  dependenciesLoading: any;
}

function getLabelClassNameForRepo(repo: Dependency.Repo): string {
  const classNames = {
    bower: style.labelWarning,
    npm: style.labelWarning,
    yarn: style.labelWarning,
  };

  return `${style.label} ${classNames[repo]}`;
}

function getNormalizedVersion(version: string): string {
  if (!version) {
    return null;
  }
  const [normalized] = version.match(/\d.+/);
  return normalized;
}

export class Dependencies extends React.Component<Props> {
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

  renderInstalledVersion(dependency: Dependency.Entire): React.ReactNode {
    if (dependency.installed === undefined) {
      return <Loader />;
    }

    if (dependency.installed === null) {
      return <span className={style.missing}>missing</span>;
    }

    if (getNormalizedVersion(dependency.required) === dependency.installed) {
      return <span>{dependency.installed}</span>;
    }

    return (
      <Button
        disabled={this.props.dependenciesLoading[dependency.name]}
        icon="cloud-download"
        variant="success"
        scale="small"
      >{dependency.installed}
      </Button>
    );
  }

  renderWantedVersion(dependency: Dependency.Entire): React.ReactNode {
    if (dependency.wanted === null) {
      return '-';
    }

    if (dependency.wanted) {
      return (
        <Button
          disabled={this.props.dependenciesLoading[dependency.name]}
          icon="cloud-download"
          variant="success"
          scale="small"
        >{dependency.wanted}
        </Button>
      );
    }

    return '';
  }

  renderLatestVersion(dependency: Dependency.Entire): React.ReactNode {
    if (dependency.latest === null) {
      return '-';
    }

    if (dependency.latest) {
      return (
        <Button
          disabled={this.props.dependenciesLoading[dependency.name]}
          icon="cloud-download"
          variant="success"
          scale="small"
        >{dependency.latest}
        </Button>
      );
    }

    return '';
  }

  render(): React.ReactNode {
    return (
      <div className={style.dependencies}>
        <header>
          <SearchContainer />
          <div className={style.right}>
            <small>Install:</small>
            &nbsp;
            <Button variant="primary" scale="small" icon="data-transfer-download">All</Button>
            <Button
              variant="primary"
              scale="small"
              icon="data-transfer-download"
              disabled={true}
            >Prod
            </Button>
            <Button
              variant="dark"
              scale="small"
              icon="data-transfer-download"
              disabled={true}
            >Dev
            </Button>
            &nbsp;
            <small>Update all to:</small>
            &nbsp;
            <Button
              variant="success"
              scale="small"
              icon="cloud-download"
            >Installed
            </Button>
            <Button
              variant="success"
              scale="small"
              icon="cloud-download"
            >Wanted
            </Button>
            <Button
              variant="success"
              scale="small"
              icon="cloud-download"
            >Latest
            </Button>
            &nbsp;
            &nbsp;
            <Button
              variant="danger"
              scale="small"
              icon="loop-circular"
            >Force Re-Install
            </Button>
          </div>
        </header>
        <div className={style.tableContainer}>
          <table v-show="!loading" className={style.table}>
            <thead>
              <tr>
                {this.renderThs()}
              </tr>
            </thead>
            <tbody>
              {
                this.props.dependencies &&
                this.props.dependencies.map(dependency => (
                  <tr key={`${dependency.name}${dependency.repo}`}>
                    <td>{dependency.type !== 'prod' && dependency.type}</td>
                    <td>
                      {dependency.name}
                      <span className={getLabelClassNameForRepo(dependency.repo)}>
                        {dependency.repo}</span>
                    </td>
                    <td className={style.columnVersion}>
                      {dependency.required}
                      {!dependency.required && <span className={style.missing}>extraneous</span>}
                    </td>
                    <td className={style.columnNsp}> ? </td>
                    <td className={style.columnVersion}>
                      {this.renderInstalledVersion(dependency)}
                    </td>
                    <td className={style.columnVersion}>
                      {this.renderWantedVersion(dependency)}
                    </td>
                    <td className={style.columnVersion}>
                      {this.renderWantedVersion(dependency)}
                    </td>
                    <td className={style.columnAction}>
                      <Button
                        disabled={this.props.dependenciesLoading[dependency.name]}
                        icon="trash"
                        variant="danger"
                        scale="small"
                      >remove
                      </Button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
