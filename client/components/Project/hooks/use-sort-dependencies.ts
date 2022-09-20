import { useCallback, useState } from 'react';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';

type SortType =
  | 'installed'
  | 'latest'
  | 'latest'
  | 'name'
  | 'required'
  | 'score'
  | 'size'
  | 'type'
  | 'wanted'
  | undefined;

interface Hook {
  dependenciesSorted?: DependencyInstalledExtras[];
  onSortChange: (sortName: SortType) => void;
  sortReversed: boolean;
  sort: SortType;
}

const GREATER = -1;
const LOWER = 1;
const EQUAL = 0;

export const useSortDependencies = (
  dependencies?: DependencyInstalledExtras[],
): Hook => {
  const [sort, setSort] = useState<SortType>();
  const [sortReversed, setSortReversed] = useState(false);

  const onSortChange = useCallback<Hook['onSortChange']>(
    (sortName) => {
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
    },
    [sort, sortReversed],
  );

  let dependenciesSorted = dependencies && [...dependencies];

  if (sort !== undefined && dependenciesSorted) {
    // Mutated
    dependenciesSorted.sort((depA, depB): number => {
      const valueA = depA[sort] ?? undefined;
      const valueB = depB[sort] ?? undefined;
      if (
        (typeof valueA === 'string' && typeof valueB === 'string') ||
        (typeof valueA === 'number' && typeof valueB === 'number')
      ) {
        if (valueA > valueB) {
          return sortReversed ? LOWER : GREATER;
        }
        if (valueA < valueB) {
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
    });
  } else if (dependenciesSorted) {
    // Mutated
    const regular = dependenciesSorted.filter(
      (dep) => !dep.name.startsWith('@types'),
    );

    const types = dependenciesSorted.filter((dep) =>
      dep.name.startsWith('@types'),
    );

    // eslint-disable-next-line unicorn/no-array-reduce
    const typesNotAssigned = types.reduce((notAssigned, typeDep) => {
      const index = regular.findIndex(
        (dep) => dep.name === typeDep.name.split('@types/')[1],
      );
      if (index !== -1) {
        regular.splice(index + 1, 0, typeDep);
      } else {
        notAssigned.push(typeDep);
      }
      return notAssigned;
    }, [] as DependencyInstalledExtras[]);

    dependenciesSorted = [...regular, ...typesNotAssigned];
  }

  return {
    onSortChange,
    sort,
    sortReversed,
    dependenciesSorted,
  };
};
