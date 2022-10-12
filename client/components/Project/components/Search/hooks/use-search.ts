import { useCallback, useState } from 'react';

import type { SearchResult } from '../../../../../../server/types/dependency.types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const onSearch = useCallback(async (query) => {
    const response = await fetch('/api/search/npm', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    const data = (await response.json()) as SearchResult[];

    setSearchResults(data);
  }, []);

  return { searchResults, onSearch };
};
