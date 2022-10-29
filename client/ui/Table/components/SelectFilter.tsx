/* eslint-disable styled-components-a11y/no-onchange */
/* eslint-disable @typescript-eslint/ban-types */
import styled from 'styled-components';

import type { FilterProps } from './shared';
import { preventEvent } from './shared';

const Select = styled.select`
  display: inline-block;
  height: 15px;
  vertical-align: middle;
  padding: 0;
`;

export const SelectFilter = <T extends string>({
  selectedValue,
  onFilterChange,
}: FilterProps<T>): JSX.Element => (
  <Select
    onChange={(event): void => {
      onFilterChange(event.target.value as T);
    }}
    onClick={preventEvent}
  >
    <option selected={selectedValue === 'any'} value="any">
      any
    </option>

    <option selected={selectedValue === 'dev'} value="dev">
      dev
    </option>

    <option selected={selectedValue === 'prod'} value="prod">
      prod
    </option>
  </Select>
);
