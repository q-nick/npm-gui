import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../../../ui/Button/Button';
import { Loader } from '../../../../Loader/Loader';
import { useSearch } from '../hooks/useSearch';

const Form = styled.form`
  margin-bottom: 6px;
  margin-top: 6px;

  & > input,
  & > select {
    display: inline-block;
    width: 7em;
    vertical-align: top;
  }

  & > input:disabled,
  & > select:disabled {
    background: lightgray;
    cursor: not-allowed;
  }
`;

type Hook = ReturnType<typeof useSearch>;

export interface Props {
  onSubmit: (query: string) => void;
  searchResults: Hook['searchResults'];
}

export function SearchForm({ onSubmit, searchResults }: Props): JSX.Element {
  const [query, setQuery] = useState('');

  return (
    <Form onSubmit={(e) => { e.preventDefault(); onSubmit(query); }}>
      <select disabled={searchResults === undefined}>
        <option value="npm">npm</option>
      </select>
      &nbsp;
      <input
        type="text"
        placeholder="type name"
        disabled={searchResults === undefined}
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      &nbsp;
      <Button
        variant="success"
        disabled={searchResults === undefined}
        type="submit"
        scale="small"
      >
        {searchResults === undefined ? <Loader /> : 'search'}
      </Button>
    </Form>
  );
}
