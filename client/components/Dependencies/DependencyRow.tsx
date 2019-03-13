import * as React from 'react';
import * as style from './Dependencies.css';
import { Button } from '../Button/Button';
import { Loader } from '../Loader/Loader';
import { ConfirmButton } from '../ConfirmButton/ConfirmButton';

interface Props {
  dependency: Dependency.Entire;
  isProcessing: boolean;
  onDeleteDependency: (dependency: Dependency.Entire) => void;
  onInstallDependencyVersion: (dependency: Dependency.Entire, version: string) => void;
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

export class DependencyRow extends React.PureComponent<Props> {
  onDeleteDependency = (): void => {
    this.props.onDeleteDependency(this.props.dependency);
  }

  onInstallDependencyLatestVersion = (): void => {
    this.props.onInstallDependencyVersion(this.props.dependency, this.props.dependency.latest);
  }

  onInstallDependencyWantedVersion = (): void => {
    this.props.onInstallDependencyVersion(this.props.dependency, this.props.dependency.wanted);
  }

  onInstallDependencyInstalledVersion = (): void => {
    this.props.onInstallDependencyVersion(this.props.dependency, this.props.dependency.installed);
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
        disabled={this.props.isProcessing}
        icon="cloud-download"
        variant="success"
        scale="small"
        onClick={this.onInstallDependencyInstalledVersion}
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
          disabled={this.props.isProcessing}
          icon="cloud-download"
          variant="success"
          scale="small"
          onClick={this.onInstallDependencyWantedVersion}
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
          disabled={this.props.isProcessing}
          icon="cloud-download"
          variant="success"
          scale="small"
          onClick={this.onInstallDependencyLatestVersion}
        >{dependency.latest}
        </Button>
      );
    }

    return '';
  }

  render(): React.ReactNode {
    return (
      <tr
        key={`${this.props.dependency.name}${this.props.dependency.repo}`}
        className={this.props.isProcessing && style.processing}
      >
        <td>{this.props.dependency.type !== 'prod' && this.props.dependency.type}</td>
        <td>
          {this.props.dependency.name}
          <span className={getLabelClassNameForRepo(this.props.dependency.repo)}>
            {this.props.dependency.repo}</span>
        </td>
        {/* <td className={style.columnNsp}> ? </td> */}
        <td className={style.columnVersion}>
          {this.props.dependency.required}
          {!this.props.dependency.required && <span className={style.missing}>extraneous</span>}
        </td>
        <td className={style.columnVersion}>
          {this.renderInstalledVersion(this.props.dependency)}
        </td>
        <td className={style.columnVersion}>
          {this.renderWantedVersion(this.props.dependency)}
        </td>
        <td className={style.columnVersion}>
          {this.renderLatestVersion(this.props.dependency)}
        </td>
        <td className={style.columnAction}>
          <ConfirmButton
            disabled={this.props.isProcessing}
            icon="trash"
            variant="danger"
            scale="small"
            onClick={this.onDeleteDependency}
          />
        </td>
      </tr>
    );
  }
}
