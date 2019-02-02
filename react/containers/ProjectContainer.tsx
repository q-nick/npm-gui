import * as React from 'react';
import { observer } from 'mobx-react';
import { Project } from '../components/project/Project';
import { withRouter, RouteComponentProps } from 'react-router';

interface Props {
}

@observer
class ProjectContainerBase extends React.Component<Props & RouteComponentProps> {
  constructor(props:Props & RouteComponentProps) {
    super(props);

    this.onSelectPath = this.onSelectPath.bind(this);
  }

  onSelectPath(path:string):void {
    this.props.history.push(`/project/${window.btoa(path)}`);
  }

  render(): React.ReactNode {
    const projectPath = (this.props.match.params as any).projectPathEncoded;
    console.log(this.props.match.params);
    return (
      <Project
        onSelectPath={this.onSelectPath}
        projectPath={projectPath}
      />
    );
  }
}

export const ProjectContainer = withRouter(ProjectContainerBase); // tslint:disable-line
