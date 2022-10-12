import type { ReactNode } from 'react';
import type { CSSProp } from 'styled-components';
import styled, { css } from 'styled-components';

import { Icon } from '../../../../ui/Icon/Icon';
import { SelectFilter } from './components/SelectFilter';
import { TextFilter } from './components/TextFilter';

interface ThStyledProps {
  sortable?: boolean;
  appearance?: CSSProp;
}

export const ThStyled = styled.th`
  ${({ sortable }: ThStyledProps): CSSProp =>
    sortable === true
      ? css`
          cursor: pointer;
          user-select: none;
        `
      : ''}

  ${({ appearance }: ThStyledProps): CSSProp => appearance ?? ''}
`;

const SortableIcon = styled(Icon)`
  position: absolute;
  margin-left: -1.2em;
`;

export interface Props<T extends string> {
  children: ReactNode;
  appearance?: CSSProp;

  sortActive: boolean;
  sortReversed?: boolean;
  onClick: () => void;

  filterType?: 'select' | 'text';
  filterValue?: T;
  filterOptions?: T[];
  onFilterChange?: (filterValue: T) => void;
}

export const ThSortable = <T extends string>({
  children,
  appearance,
  sortActive,
  sortReversed,
  onClick,
  filterType,
  filterValue,
  onFilterChange,
}: // eslint-disable-next-line @typescript-eslint/ban-types
Props<T>): JSX.Element => (
  <ThStyled appearance={appearance} onClick={onClick} sortable>
    {sortActive && (
      <SortableIcon
        glyph={sortReversed === true ? 'caret-bottom' : 'caret-top'}
      />
    )}
    {children}
    &nbsp;
    {onFilterChange && filterValue !== undefined && (
      <>
        {filterType === 'text' && (
          <TextFilter<T>
            onFilterChange={onFilterChange}
            selectedValue={filterValue}
          />
        )}

        {filterType === 'select' && (
          <SelectFilter<T>
            onFilterChange={onFilterChange}
            selectedValue={filterValue}
          />
        )}
      </>
    )}
  </ThStyled>
);
