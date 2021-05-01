import { useCallback, useState } from 'react';
import type * as Dependency from '../../../../server/types/Dependency';

type SortType = 'installed' | 'latest' | 'latest' | 'name' | 'required' | 'type' | 'wanted' | undefined;

interface Hook {
  dependenciesSorted?: Dependency.Entire[];
  onSortChange: (sortName: SortType) => void;
  sortReversed: boolean;
  sort: SortType;
}

const GREATER = -1;
const LOWER = 1;
const EQUAL = 0;

export function useSortDependencies(dependencies?: Dependency.Entire[]): Hook {
  const [sort, setSort] = useState<SortType>();
  const [sortReversed, setSortReversed] = useState(false);

  const onSortChange = useCallback<Hook['onSortChange']>((sortName) => {
    if (sort === sortName) {
      if (sortReversed) {
        setSort(undefined);
      } else {
        setSortReversed((v) => !v);
      }
    } else {
      setSortReversed(false);
      setSort(sortName);
    }
  }, [sort, sortReversed]);

  const dependenciesSorted = dependencies && [...dependencies];

  if (sort !== undefined && dependenciesSorted) {
    dependenciesSorted.sort( // mutated
      (depA, depB): number => {
        const valueA = depA[sort] ?? undefined;
        const valueB = depB[sort] ?? undefined;
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          if (valueA > valueB) {
            return sortReversed ? LOWER : GREATER;
          } if (valueA < valueB) {
            return sortReversed ? GREATER : LOWER;
          }
          return EQUAL;
        }
        if (valueA !== undefined && valueB === undefined) {
          return sortReversed ? LOWER : GREATER;
        }
        if (valueA === undefined && valueB !== undefined) {
          return sortReversed ? GREATER : LOWER;
        }

        return EQUAL;
      },
    );
  }

  return {
    onSortChange,
    sort,
    sortReversed,
    dependenciesSorted,
  };
}
