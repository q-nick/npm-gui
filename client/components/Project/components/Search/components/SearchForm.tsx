import type { VFC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import type { SearchResponse } from '../../../../../../server/types/global.types';
import { Button } from '../../../../../ui/Button/Button';
import { Link } from '../../../../../ui/Button/Link';
import { Loader } from '../../../../../ui/Loader';

const Form = styled.form`
  margin-bottom: 6px;
  margin-top: 6px;

  & > select {
    display: inline-block;
    width: 5em;
    vertical-align: top;
  }

  & > input {
    display: inline-block;
    width: 11em;
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
  searchResults: SearchResponse;
}

export const SearchForm: VFC<Props> = ({ onSubmit, searchResults }) => {
  const [query, setQuery] = useState('');

  return (
    <Form
      onSubmit={(event): void => {
        event.preventDefault();
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
        placeholder="find a new package"
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
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Link
        href="https://npms.io/"
        style={{ fontWeight: 'normal' }}
        target="_blank"
        title="Visit npms.io website"
      >
        source: npms.io
      </Link>
    </Form>
  );
};
