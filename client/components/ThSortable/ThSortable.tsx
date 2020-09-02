import React, { ReactNode } from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { Icon } from '../../ui/Icon/Icon';
import { TextFilter } from './components/TextFilter';
import { SelectFilter } from './components/SelectFilter';

export interface Filter {
  type: 'text' | 'select' | null;
  value: any;
  options: any[];
}

interface ThStyledProps {
  sortable?: boolean;
  appearance?: FlattenSimpleInterpolation;
}

export const ThStyled = styled.th`
  ${({ sortable }: ThStyledProps) => sortable && css`
    cursor: pointer;
    user-select: none;
  `}

  ${({ appearance }: ThStyledProps) => appearance}
`;

const SortableIcon = styled(Icon)`
  position: absolute;
  margin-left: -1.2em;
`;

export interface Props {
  sortMatch: string;
  sortKey: string;
  sortReversed?: boolean;
  filter?: Filter;
  onSortChange: (sortKey: string) => void;
  onFilterChange: (filterName: string, filterValue: any) => void;
  children: ReactNode;
  appearance?: FlattenSimpleInterpolation;
}

const isTextFilter = (filter:Filter): boolean => filter.type === 'text';

const isSelectFilter = (filter:Filter): boolean => filter.type === 'select';

export function ThSortable({
  sortKey, sortMatch, sortReversed, onSortChange, children, filter, onFilterChange, appearance,
}: Props): JSX.Element {
  return (
    <ThStyled onClick={() => onSortChange(sortMatch)} sortable appearance={appearance}>
      {sortKey === sortMatch && <SortableIcon glyph={sortReversed ? 'caret-bottom' : 'caret-top'} />}
      {children}
      &nbsp;
      {filter && isTextFilter(filter) && (
        <TextFilter
          value={filter.value}
          onFilterChange={(newValue) => onFilterChange(sortMatch, newValue)}
        />
      )}
      {filter && isSelectFilter(filter) && (
      <SelectFilter
        value={filter.value}
        onFilterChange={(newValue) => onFilterChange(sortMatch, newValue)}
      />
      )}
    </ThStyled>
  );
}
