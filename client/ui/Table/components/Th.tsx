import type { FC, ReactNode } from 'react';
import type { CSSProp } from 'styled-components';
import styled, { css } from 'styled-components';

import { Icon } from '../../Icon/Icon';
import { SelectFilter } from './SelectFilter';
import { TextFilter } from './TextFilter';

interface WrapperProps {
  onClick?: unknown;
}

const Wrapper = styled.th<WrapperProps>`
  ${({ onClick }: WrapperProps): CSSProp =>
    onClick
      ? css`
          cursor: pointer;
          user-select: none;
        `
      : ''}
`;

const SortableIcon = styled(Icon)`
  position: absolute;
  margin-left: -1.2em;
`;

export interface Props {
  children?: ReactNode;

  sortActive?: boolean;
  sortReversed?: boolean;
  onSortChange?: () => void;

  filterable?: string[] | true;
  filterValue?: string;
  onFilterChange?: (newFilterValue: string) => void;
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
  <Wrapper onClick={onSortChange}>
    {sortActive && (
      <SortableIcon
        glyph={sortReversed === true ? 'caret-bottom' : 'caret-top'}
      />
    )}
    {children}
    {children && <>&nbsp;</>}
    {onFilterChange && (
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
  </Wrapper>
);
