import React from 'react';
import styled from 'styled-components';
import { FilterProps, preventEvent } from './shared';

const Select = styled.select`
  display: inline-block;
  height: 15px;
  vertical-align: middle;
  padding: 0;
`;

export function SelectFilter({ value, onFilterChange }:FilterProps): JSX.Element {
  return (
    <Select
      value={value}
      onClick={preventEvent}
      onChange={(event) => onFilterChange(event.target.value)}
    >
      <option value="">any</option>
      <option value="dev">dev</option>
      <option value="prod">prod</option>
    </Select>
  );
}
