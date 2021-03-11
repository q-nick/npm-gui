import { useState } from 'react';
import { ZERO } from '../../../utils';
import type * as Dependency from '../../../../server/types/Dependency';

interface Hook {
  dependenciesFiltered?: Dependency.Entire[];
  isEmpty: boolean;
  isLoading: boolean;
  filterTypeValue: Dependency.Type | 'any';
  filterNameValue: string;
  setFilterTypeValue: (value: Dependency.Type | 'any') => void;
  setFilterNameValue: (value: string) => void;
}

export function useFilterDependencies(dependencies?: Dependency.Entire[]): Hook {
  const [filterTypeValue, setFilterTypeValue] = useState<Hook['filterTypeValue']>('any');
  const [filterNameValue, setFilterNameValue] = useState<string>('');

  const dependenciesFiltered = dependencies?.filter((dependency): boolean => {
    if (filterNameValue && !dependency.name.includes(filterNameValue)) {
      return false;
    }
    if (filterTypeValue !== 'any' && dependency.type !== filterTypeValue) {
      return false;
    }
    return true;
  });

  return {
    dependenciesFiltered,
    isEmpty: !!dependencies && dependencies.length === ZERO,
    isLoading: !dependencies,
    setFilterNameValue,
    setFilterTypeValue,
    filterTypeValue,
    filterNameValue,
  };
}
