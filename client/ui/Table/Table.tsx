import styled, { css } from 'styled-components';

import type { CSSType } from '../../Styled';
import { Loader } from '../Loader';
import type { IColumn, TableRowAbstract } from './components/TbodyRow';
import { TbodyRow } from './components/TbodyRow';
import { Th } from './components/Th';
import { useTableSort } from './use-table-sort';

export interface Props<T extends TableRowAbstract> {
  readonly columns: IColumn<T>[];
  // data
  readonly tableData?: T[];
  readonly isEmpty: boolean;
  // filter
  readonly filters: Record<string, string>;
  readonly onFilterChange?: (
    columnName: string,
    newFilterValue: string,
  ) => void;
  // other
  readonly maxHeight?: string;
}

const Wrapper = styled.div<{ maxHeight?: string }>`
  border: 1px solid #dfd7ca;
  border-radius: 2px;
  margin-top: 7px;
  flex: 1;
  position: relative;
  overflow-y: scroll;

  ${({ maxHeight }): CSSType =>
    maxHeight
      ? css`
          max-height: ${maxHeight};
        `
      : ''}
`;

const Info = styled.div`
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  pointer-events: none;
`;

const Thead = styled.thead`
  position: sticky;
  top: 0;
  background: white;
  box-shadow: inset 0 -2px 0 #dfd7ca;
  z-index: 1;
`;

const Tbody = styled.tbody`
  td {
    padding: 3px;
  }
`;

export const Table = <T extends TableRowAbstract>({
  columns,
  filters,
  onFilterChange,
  isEmpty,
  tableData,
  maxHeight,
}: // eslint-disable-next-line @typescript-eslint/ban-types
Props<T>): JSX.Element => {
  const { sort, sortReversed, onSortChange, tableDataSorted } =
    useTableSort(tableData);

  return (
    <Wrapper maxHeight={maxHeight}>
      <Info>
        {isEmpty ? <>empty...</> : null}

        {!tableData && (
          <>
            <Loader />
            &nbsp;loading...
          </>
        )}
      </Info>

      <table>
        <Thead>
          <tr>
            {columns.map((column) => {
              return (
                <Th
                  filterValue={filters[column.name]}
                  filterable={column.filterable}
                  key={`head-column-${column.name}`}
                  onFilterChange={
                    column.filterable && onFilterChange
                      ? (newFilterValue): void =>
                          onFilterChange(column.name, newFilterValue)
                      : undefined
                  }
                  onSortChange={
                    column.sortable
                      ? (): void => onSortChange(column.name)
                      : undefined
                  }
                  sortActive={column.name === sort}
                  sortReversed={sortReversed}
                >
                  {column.label === undefined ? column.name : column.label}
                </Th>
              );
            })}
          </tr>
        </Thead>

        <Tbody>
          {tableDataSorted?.map((row) => (
            <TbodyRow columns={columns} key={row.name} row={row} />
          ))}
        </Tbody>
      </table>
    </Wrapper>
  );
};
