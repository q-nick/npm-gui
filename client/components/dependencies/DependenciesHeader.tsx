import * as React from 'react';
import * as style from './dependencies.css';
import { Button } from '../button/Button';

interface Props {
  onInstallAll: () => void;
  onUpdateAllToInstalled: () => void;
  onUpdateAllToWanted: () => void;
  onUpdateAllToLatest: () => void;
  onForceReInstall: () => void;
}

export class DependenciesHeader extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <header>
        {this.props.children}
        <div className={style.right}>
          <small>Install:</small>
          &nbsp;
          <Button
            variant="primary"
            scale="small"
            icon="data-transfer-download"
            onClick={this.props.onInstallAll}
          >All
          </Button>
          {/* <Button
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
          </Button> */}
          &nbsp;
          <small>Update all to:</small>
          &nbsp;
          <Button
            variant="success"
            scale="small"
            icon="cloud-download"
            onClick={this.props.onUpdateAllToInstalled}
          >Installed
          </Button>
          <Button
            variant="success"
            scale="small"
            icon="cloud-download"
            onClick={this.props.onUpdateAllToWanted}
          >Wanted
          </Button>
          <Button
            variant="success"
            scale="small"
            icon="cloud-download"
            onClick={this.props.onUpdateAllToLatest}
          >Latest
          </Button>
          &nbsp;
          &nbsp;
          <Button
            variant="danger"
            scale="small"
            icon="loop-circular"
            onClick={this.props.onForceReInstall}
          >Force Re-Install
          </Button>
        </div>
      </header>
    );
  }
}
