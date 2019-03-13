import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { SearchStore } from '../stores/search.store';
import { Search } from '../components/Search/Search';
import { toJS } from 'mobx';

interface Props {
  searchStore?: SearchStore;
  onInstall: (repo: Dependency.Repo, dependency: Dependency.Basic, type: Dependency.Type) => void;
  type: 'global' | 'project';
}

const types:{
  [key: string]: Dependency.Type[],
} = {
  global: ['global'],
  project: ['prod', 'dev'],
};

@inject('searchStore') @observer
export class SearchContainer extends React.Component<Props> {
  onSearch = (query: string, repo: Dependency.Repo): void => {
    this.props.searchStore.fetchSearch(query, repo);
  }

  render(): React.ReactNode {
    const searchResults = toJS(this.props.searchStore.results);
    return (
      <Search
        searchResults={searchResults}
        onSearch={this.onSearch}
        onInstall={this.props.onInstall}
        types={types[this.props.type]}
      />
    );
  }
}
