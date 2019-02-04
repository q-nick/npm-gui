import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { DependenciesStore } from '../stores/dependencies.store';
import { Dependencies } from '../components/dependencies/Dependencies';
import { toJS } from 'mobx';

interface Props {
  globalDependenciesStore?: DependenciesStore;
}

@inject('globalDependenciesStore') @observer
export class GlobalDependenciesContainer extends React.Component<Props> {
  componentDidMount():void {
    console.log('project dependencies did monut', this.props);
    this.props.globalDependenciesStore.fetchDependencies();
  }

  render(): React.ReactNode {
    const dependencies = toJS(this.props.globalDependenciesStore.dependencies);
    const dependenciesLoading = toJS(this.props.globalDependenciesStore.dependenciesLoading);
    const sortMatch = toJS(this.props.globalDependenciesStore.sortMatch);
    const sortKey = toJS(this.props.globalDependenciesStore.sortKey);
    const sortReversed = toJS(this.props.globalDependenciesStore.sortReversed);

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
