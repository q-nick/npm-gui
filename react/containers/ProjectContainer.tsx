import * as React from 'react';
import { Project } from '../components/project/Project';
import { withRouter, RouteComponentProps } from 'react-router';

class ProjectContainerBase extends React.Component<RouteComponentProps> {
  constructor(props:RouteComponentProps) {
    super(props);

    this.onSelectPath = this.onSelectPath.bind(this);
  }

  onSelectPath(path:string):void {
    this.props.history.push(`/project/${window.btoa(path)}/dependencies`);
  }

  render(): React.ReactNode {
    const projectPath = (this.props.match.params as any).projectPathEncoded;
    return (
      <Project
        onSelectPath={this.onSelectPath}
        projectPath={projectPath}
      />
    );
  }
}

export const ProjectContainer = withRouter(ProjectContainerBase); // tslint:disable-line
