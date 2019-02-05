import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { SearchStore } from '../stores/search.store';
import { Search } from '../components/search/Search';
import { toJS } from 'mobx';
import { DependenciesStore } from '../stores/dependencies.store';
import { withRouter, RouteComponentProps } from 'react-router';

interface Props {
  searchStore?: SearchStore;
  dependenciesStore?: DependenciesStore;
  type: 'global' | 'project';
}

const types:{
  [key: string]: Dependency.Type[],
} = {
  global: ['global'],
  project: ['prod', 'dev'],
};

@inject('searchStore', 'dependenciesStore') @observer
export class SearchContainerBase extends React.Component<Props & RouteComponentProps> {
  onSearch = (query: string, repo: Dependency.Repo): void => {
    this.props.searchStore.fetchSearch(query, repo);
  }

  onInstall = (repo: Dependency.Repo, dependency: Dependency.Basic, type: Dependency.Type)
    : void => {
    const projectPath = (this.props.match.params as any).projectPathEncoded;

    if (types['global'].includes(type)) {
      this.props.dependenciesStore.installDependency(projectPath, repo, dependency, type);
    } else {
      this.props.dependenciesStore.installDependency(projectPath, repo, dependency, type);
    }
  }

  render(): React.ReactNode {
    const searchResults = toJS(this.props.searchStore.results);
    return (
      <Search
        searchResults={searchResults}
        onSearch={this.onSearch}
        onInstall={this.onInstall}
        types={types[this.props.type]}
      />
    );
  }
}

export const SearchContainer = withRouter(SearchContainerBase); // tslint:disable-line
