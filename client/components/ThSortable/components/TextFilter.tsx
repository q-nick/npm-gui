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

export function TextFilter<T extends string>({
  value, onFilterChange,
}: FilterProps<T>): JSX.Element {
  return (
    <Input
      onChange={(event): void => { onFilterChange(event.target.value as T); }}
      onClick={preventEvent}
      type="text"
      value={value}
    />
  );
}
