import { useState } from 'react';

import type {
  DependencyInstalledExtras,
  Type,
} from '../../../../server/types/dependency.types';

interface Hook {
  dependenciesFiltered?: DependencyInstalledExtras[];
  filterTypeValue: Type | 'any';
  filterNameValue: string;
  setFilterTypeValue: (value: Type | 'any') => void;
  setFilterNameValue: (value: string) => void;
}

export const useFilterDependencies = (
  dependencies?: DependencyInstalledExtras[],
): Hook => {
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
    setFilterNameValue,
    setFilterTypeValue,
    filterTypeValue,
    filterNameValue,
  };
};
