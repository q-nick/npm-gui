import { useCallback, useState } from 'react';

import type { SearchResult } from '../../../../../../server/types/dependency.types';

interface Hook {
  searchResults?: SearchResult[];
  onSearch: (query: string) => Promise<void>;
}

export const useSearch = (): Hook => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const onSearch = useCallback<Hook['onSearch']>(async (query) => {
    const response = await fetch('/api/search/npm', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    const data = (await response.json()) as SearchResult[];

    setSearchResults(data);
  }, []);

  return { searchResults, onSearch };
};
