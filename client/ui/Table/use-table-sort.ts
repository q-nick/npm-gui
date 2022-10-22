/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useCallback, useState } from 'react';

import type { TableRowAbstract } from './Table';

const GREATER = -1;
const LOWER = 1;
const EQUAL = 0;

export const useTableSort = <T extends TableRowAbstract>(tableData?: T[]) => {
  const [sort, setSort] = useState<string>();
  const [sortReversed, setSortReversed] = useState(false);

  const onSortChange = useCallback(
    (sortName: string) => {
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

  let tableDataSorted = tableData && [...tableData];

  if (sort !== undefined && tableDataSorted) {
    // Mutated
    tableDataSorted.sort((depA, depB): number => {
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
  } else if (tableDataSorted) {
    // Mutated
    const regular = tableDataSorted.filter(
      (dep) => !dep.name.startsWith('@types'),
    );

    const types = tableDataSorted.filter((dep) =>
      dep.name.startsWith('@types'),
    );

    // eslint-disable-next-line unicorn/no-array-reduce
    const typesNotAssigned = types.reduce((notAssigned, typeDep) => {
      const index = regular.findIndex(
        (dep) => dep.name === typeDep.name.split('@types/')[1],
      );
      const rgl = regular[index];
      if (rgl) {
        rgl.hideBottomBorder = true;
        regular.splice(index + 1, 0, { ...typeDep, drawFolder: true });
      } else {
        notAssigned.push(typeDep);
      }
      return notAssigned;
    }, [] as T[]);

    tableDataSorted = [...regular, ...typesNotAssigned];
  }

  return {
    onSortChange,
    sort,
    sortReversed,
    tableDataSorted,
  };
};
