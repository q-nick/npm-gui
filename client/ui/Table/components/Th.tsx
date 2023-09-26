import type { FC, ReactNode } from 'react';

import { Icon } from '../../Icon/Icon';
import { SelectFilter } from './SelectFilter';
import { TextFilter } from './TextFilter';

export interface Props {
  readonly children?: ReactNode;

  readonly sortActive?: boolean;
  readonly sortReversed?: boolean;
  readonly onSortChange?: () => void;

  readonly filterable?: string[] | true;
  readonly filterValue?: string;
  readonly onFilterChange?: (newFilterValue: string) => void;
}

export const Th: FC<Props> = ({
  children,
  filterable,
  sortActive,
  sortReversed,
  onSortChange,
  filterValue = '',
  onFilterChange,
}) => (
  <th
    className={onSortChange ? 'cursor-pointer select-none' : ''}
    onClick={onSortChange}
  >
    {sortActive ? (
      <Icon
        className="position-absolute ml-5"
        glyph={sortReversed === true ? 'caret-bottom' : 'caret-top'}
      />
    ) : null}
    {children}
    {children ? <>&nbsp;</> : null}
    {!!onFilterChange && (
      <>
        {!Array.isArray(filterable) && (
          <TextFilter
            onFilterChange={onFilterChange}
            selectedValue={filterValue}
          />
        )}

        {Array.isArray(filterable) && (
          <SelectFilter
            onFilterChange={onFilterChange}
            selectedValue={filterValue}
          />
        )}
      </>
    )}
  </th>
);
