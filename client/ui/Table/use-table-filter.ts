import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useTableFilter = <
  T extends { [key: string]: unknown; name: string },
>(
  tableData?: T[],
) => {
  const [filters, setFilters] = useState<Record<string, string>>({});

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
