import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../../ui/Button/Button';
import { Loader } from '../Loader/Loader';

interface Props {
  searchResults: Dependency.SearchResult[];
  types: Dependency.Type[];
  onSearch: (query: string, repo: Dependency.Repo) => void;
  onInstall: (repo: Dependency.Repo, dependency: Dependency.Basic, type: Dependency.Type) => void;
}

const Wrapper = styled.div`
  background: #fff;
  border: 1px solid #fff;
  border-radius: 2px;
  margin-left: -7.5px;
  margin-top: -7.5px;
  max-height: 34px;
  max-width: 120px;
  overflow: hidden;
  padding: 7.5px;
  position: absolute;
  transition: max-width 300ms, max-height 300ms;
  z-index: 1;

  ${({ isOpen }:{ isOpen: boolean }) => isOpen && css`
    border-color: #dfd7ca;
    max-height: 100%;
    max-width: 100%;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  `}
`;

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

const TableContainer = styled.div`
  max-height: 50vh;
  overflow-y: scroll;
`;

interface SearcResultsProps extends Pick<Props, 'searchResults'|'types'|'onInstall'> {
  repo: 'npm' | 'bower';
}

interface SearchFormProps extends Pick<Props, 'searchResults'> {
  onSubmit: (query: string) => void;
}

function SearchForm({ onSubmit, searchResults }:SearchFormProps): JSX.Element {
  const [query, setQuery] = useState('');

  return (
    <Form onSubmitCapture={() => onSubmit(query)}>
      <select disabled={searchResults === undefined}>
        <option value="npm">npm</option>
        <option value="bower">bower</option>
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

function SearchResults({
  searchResults, types, repo, onInstall,
}: SearcResultsProps): JSX.Element {
  return (
    <table>
      <tbody>
        <tr>
          <th>score</th>
          <th>name</th>
          <th>version</th>
          <th>github</th>
          <th>install</th>
        </tr>
        {
            searchResults
            && searchResults.map((result) => (
              <tr key={result.name}>
                <td>
                  {(result.score * 100).toFixed(2)}
                  %
                </td>
                <td>
                  <strong>{result.name}</strong>
                </td>
                <td>{result.version}</td>
                <td>
                  <a target="_blank" rel="noreferrer" href={result.url}>show repo</a>
                </td>
                <td>
                  {
                    types.map((type) => (
                      <Button
                        key={`${result.name}${type}`}
                        variant="info"
                        scale="small"
                        onClick={() => onInstall(
                          repo,
                          { name: result.name, version: result.version },
                          type,
                        )}
                      >
                        {type}
                      </Button>
                    ))
                  }
                </td>
              </tr>
            ))
}
      </tbody>
    </table>

  );
}

export function Search({
  searchResults, onInstall, types, onSearch,
}:Props):JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [repo, setRepo] = useState<'npm' | 'bower'>('npm');

  const onToggleOpen = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const onInstallAndClose = useCallback(
    (...args:[Dependency.Repo, Dependency.Basic, Dependency.Type]) => {
      onInstall(...args);
      setIsOpen(false);
    }, [onInstall],
  );

  return (
    <Wrapper isOpen={isOpen}>
      <Button
        variant="primary"
        scale="small"
        icon="plus"
        onClick={onToggleOpen}
      >
        Search / Add
      </Button>
      <SearchForm
        onSubmit={(query) => onSearch(query, repo)}
        searchResults={searchResults}
      />
      <TableContainer>
        {searchResults && searchResults.length && (
          <SearchResults
            searchResults={searchResults}
            onInstall={onInstallAndClose}
            types={types}
            repo={repo}
          />
        )}
      </TableContainer>
    </Wrapper>
  );
}
