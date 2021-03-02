import type { ReactNode } from 'react';
import React from 'react';
import type { CSSProp } from 'styled-components';
import styled, { css } from 'styled-components';
import { Icon } from '../../ui/Icon/Icon';
import { TextFilter } from './components/TextFilter';
import { SelectFilter } from './components/SelectFilter';

interface ThStyledProps {
  sortable?: boolean;
  appearance?: CSSProp;
}

export const ThStyled = styled.th`
  ${({ sortable }: ThStyledProps): CSSProp => (sortable ? css`
    cursor: pointer;
    user-select: none;
  ` : '')}

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

export function ThSortable<T extends string>({
  children, appearance,
  sortActive, sortReversed, onClick,
  filterType, filterValue, onFilterChange,
}: Props<T>): JSX.Element {
  return (
    <ThStyled
      appearance={appearance}
      onClick={onClick}
      sortable
    >
      {sortActive && <SortableIcon glyph={sortReversed === true ? 'caret-bottom' : 'caret-top'} />}

      {children}
      &nbsp;
      {onFilterChange && filterValue!== undefined && (
      <>
        {filterType === 'text' && (
          <TextFilter<T>
            onFilterChange={onFilterChange}
            value={filterValue}
          />
        )}

        {filterType === 'select' && (
        <SelectFilter<T>
          onFilterChange={onFilterChange}
          value={filterValue}
        />
        )}
      </>
      )}

    </ThStyled>
  );
}
