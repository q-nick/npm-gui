import { useCallback, useState } from 'react';

import type { SearchResponse } from '../../../../../../server/types/global.types';
import { fetchJSON } from '../../../../../service/utils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResponse>([]);

  const onSearch = useCallback(async (query) => {
    const result = await fetchJSON<SearchResponse>('/api/search/npm', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

    setSearchResults(result);
  }, []);

  return { searchResults, onSearch };
};
