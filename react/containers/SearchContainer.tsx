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
  render(): React.ReactNode {
    const searchQuery = toJS(this.props.searchStore.searchQuery);
    const searchResults = toJS(this.props.searchStore.searchResults);
    return (
      <Search
        searchQuery={searchQuery}
        searchResults={searchResults}
      />
    );
  }
}
