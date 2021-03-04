import Axios from 'axios';
import { useCallback, useState } from 'react';
import type * as Dependency from '../../../../../../server/types/Dependency';

interface Hook {
  searchResults?: Dependency.SearchResult[];
  onSearch: (query: string) => Promise<void>;
}

export function useSearch(): Hook {
  const [searchResults, setSearchResults] = useState<Dependency.SearchResult[]>([]);

  const onSearch = useCallback<Hook['onSearch']>(async (query) => {
    const { data } = await Axios.post('/api/search/npm', { query });

    setSearchResults(data);
  }, []);

  return { searchResults, onSearch };
}
