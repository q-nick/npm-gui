import { useCallback, useState } from 'react';
import type * as Dependency from '../../../../../../server/types/Dependency';

interface Hook {
  searchResults?: Dependency.SearchResult[];
  onSearch: (query: string) => Promise<void>;
}

export function useSearch(): Hook {
  const [searchResults, setSearchResults] = useState<Dependency.SearchResult[]>([]);

  const onSearch = useCallback<Hook['onSearch']>(async (query) => {
    const response = await fetch('/api/search/npm', { method: 'POST', body: JSON.stringify({ query }) });
    const data = await response.json() as Dependency.SearchResult[];

    setSearchResults(data);
  }, []);

  return { searchResults, onSearch };
}
