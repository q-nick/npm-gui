import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { SearchStore } from '../stores/search.store';
import { Search } from '../components/search/Search';
import { toJS } from 'mobx';

interface Props {
  searchStore?: SearchStore;
}

@inject('searchStore') @observer
export class SearchContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(query: string, repo: Dependency.Repo): void {
    this.props.searchStore.fetchSearch(query, repo);
  }

  render(): React.ReactNode {
    const searchResults = toJS(this.props.searchStore.results);
    return (
      <Search
        searchResults={searchResults}
        onSearch={this.onSearch}
      />
    );
  }
}
