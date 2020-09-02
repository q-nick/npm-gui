import React from 'react';
import styled from 'styled-components';
import { FilterProps, preventEvent } from './shared';

const Input = styled.input`
  display: inline-block;
  height: 15px;
  vertical-align: middle;
  padding: 0;
  width: 4em;
`;

export function TextFilter({ value, onFilterChange }:FilterProps): JSX.Element {
  return (
    <Input
      value={value}
      type="text"
      onClick={preventEvent}
      onChange={(event) => onFilterChange(event.target.value)}
    />
  );
}
