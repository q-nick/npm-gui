import styled from 'styled-components';

import type { FilterProps } from './shared';
import { preventEvent } from './shared';

const Input = styled.input`
  display: inline-block;
  height: 15px;
  vertical-align: middle;
  padding: 0;
  width: 4em;
`;

export const TextFilter = <T extends string>({
  selectedValue,
  onFilterChange,
}: // eslint-disable-next-line @typescript-eslint/ban-types
FilterProps<T>): JSX.Element => (
  <Input
    onChange={(event): void => {
      onFilterChange(event.target.value as T);
    }}
    onClick={preventEvent}
    type="text"
    value={selectedValue}
  />
);
