/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState } from 'react';
import { useBetween } from 'use-between';

const useFiltersState = () => {
  return useState<Record<string, string>>({});
};

export const useSharedFiltersState = () => useBetween(useFiltersState);

export const useTableFilter = <
  T extends { [key: string]: unknown; name: string },
>(
  tableData?: T[],
) => {
  const [filters, setFilters] = useSharedFiltersState();

  const tableDataFiltered = tableData?.filter((row): boolean => {
    return Object.entries(filters).every(([columnName, filterValue]) => {
      const columnValue = row[columnName];

      if (filterValue && typeof columnValue === 'string') {
        return columnValue.includes(filterValue);
      }

      return true;
    });
  });

  const setFilterValue = (columnName: string, newFilterValue: string): void => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [columnName]: newFilterValue,
    }));
  };

  return {
    tableDataFiltered,
    setFilterValue,
    filters,
  };
};
