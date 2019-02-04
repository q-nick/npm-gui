import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { DependenciesStore } from '../stores/dependencies.store';
import { Dependencies } from '../components/dependencies/Dependencies';
import { toJS } from 'mobx';

interface Props {
  projectDependenciesStore?: DependenciesStore;
  projectPath: string;
}

@inject('projectDependenciesStore') @observer
export class ProjectDependenciesContainer extends React.Component<Props> {
  componentDidMount():void {
    console.log('project dependencies did monut', this.props);
    this.props.projectDependenciesStore.fetchDependencies(this.props.projectPath);
  }

  render(): React.ReactNode {
    console.log('ProjectDependenciesContainer rerender');
    const dependencies = toJS(this.props.projectDependenciesStore.dependencies);
    const dependenciesLoading = toJS(this.props.projectDependenciesStore.dependenciesLoading);
    const sortMatch = toJS(this.props.projectDependenciesStore.sortMatch);
    const sortKey = toJS(this.props.projectDependenciesStore.sortKey);
    const sortReversed = toJS(this.props.projectDependenciesStore.sortReversed);

    return (
      <Dependencies
        dependencies={dependencies}
        dependenciesLoading={dependenciesLoading}
        sortMatch={sortMatch}
        sortKey={sortKey}
        sortReversed={sortReversed}
      />
    );
  }
}
