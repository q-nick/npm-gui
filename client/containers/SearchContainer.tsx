import React, { useCallback, useState } from 'react';
import Axios from 'axios';
import { Search } from '../components/Search/Search';

interface Props {
  onInstall: (repo: Dependency.Repo, dependency: Dependency.Basic, type: Dependency.Type) => void;
  type: 'global' | 'project';
}

const types:{
  [key: string]: Dependency.Type[],
} = {
  global: ['global'],
  project: ['prod', 'dev'],
};

export function SearchContainer({ onInstall, type }:Props):JSX.Element {
  const [searchResults, setSearchResults] = useState<Dependency.SearchResult[]>([]);

  const onSearch = useCallback(async (query: string, repo: Dependency.Repo) => {
    const { data } = await Axios.post(`/api/search/${repo}`, { query });

    setSearchResults(data);
  }, []);

  return (
    <Search
      searchResults={searchResults}
      onSearch={onSearch}
      onInstall={onInstall}
      types={types[type]}
    />
  );
}
