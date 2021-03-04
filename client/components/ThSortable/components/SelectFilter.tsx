import styled from 'styled-components';
import type { FilterProps } from './shared';
import { preventEvent } from './shared';

const Select = styled.select`
  display: inline-block;
  height: 15px;
  vertical-align: middle;
  padding: 0;
`;

export function SelectFilter<T extends string>({
  value, onFilterChange,
}: FilterProps<T>): JSX.Element {
  return (
    <Select
      onChange={(event): void => { onFilterChange(event.target.value as T); }}
      onClick={preventEvent}
      value={value}
    >
      <option value="">any</option>

      <option value="dev">dev</option>

      <option value="prod">prod</option>
    </Select>
  );
}
