import type { VFC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import type { SearchResult } from '../../../../../../server/types/dependency.types';
import { Button } from '../../../../../ui/Button/Button';
import { Loader } from '../../../../Loader';

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

export interface Props {
  onSubmit: (query: string) => void;
  searchResults: SearchResult[];
}

export const SearchForm: VFC<Props> = ({ onSubmit, searchResults }) => {
  const [query, setQuery] = useState('');

  return (
    <Form
      onSubmit={(e): void => {
        e.preventDefault();
        onSubmit(query);
      }}
    >
      <select disabled>
        <option value="npm">npm</option>
      </select>
      &nbsp;
      <input
        disabled={searchResults === undefined}
        onChange={(event): void => {
          setQuery(event.currentTarget.value);
        }}
        placeholder="type name"
        type="text"
        value={query}
      />
      &nbsp;
      <Button
        disabled={searchResults === undefined}
        title="Do search please"
        type="submit"
        variant="success"
      >
        {searchResults === undefined ? <Loader /> : 'search'}
      </Button>
    </Form>
  );
};
