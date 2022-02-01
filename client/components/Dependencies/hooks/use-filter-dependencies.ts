import { useState } from 'react';

import type { Entire, Type } from '../../../../server/types/dependency.types';
import { ZERO } from '../../../utils';

interface Hook {
  dependenciesFiltered?: Entire[];
  isEmpty: boolean;
  isLoading: boolean;
  filterTypeValue: Type | 'any';
  filterNameValue: string;
  setFilterTypeValue: (value: Type | 'any') => void;
  setFilterNameValue: (value: string) => void;
}

export const useFilterDependencies = (dependencies?: Entire[]): Hook => {
  const [filterTypeValue, setFilterTypeValue] =
    useState<Hook['filterTypeValue']>('any');
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
    isEmpty: Boolean(dependencies) && dependencies?.length === ZERO,
    isLoading: !dependencies,
    setFilterNameValue,
    setFilterTypeValue,
    filterTypeValue,
    filterNameValue,
  };
};
