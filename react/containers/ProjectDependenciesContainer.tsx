import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ProjectDependenciesStore } from '../stores/projectDependencies.store';
import { Dependencies } from '../components/dependencies/Dependencies';
import { toJS } from 'mobx';

interface Props {
  projectDependenciesStore?: ProjectDependenciesStore;
}

@inject('projectDependenciesStore') @observer
export class ProjectDependenciesContainer extends React.Component<Props> {
  render(): React.ReactNode {
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
