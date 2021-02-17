import React, { useCallback, useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { useClickOutsideRef } from '../../../../hooks/useClickOutside';
import { Button } from '../../../../ui/Button/Button';
import { DependenciesContext } from '../../DependenciesContext';
import { SearchForm } from './components/SearchForm';
import { SearchResults, Props as SearchResultsProps } from './components/SearchResults';
import { useSearch } from './hooks/useSearch';

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

const TableContainer = styled.div`
  max-height: 50vh;
  overflow-y: scroll;
`;

export function Search():JSX.Element {
  const { onInstallNewDependency } = useContext(DependenciesContext);
  const { searchResults, onSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);

  const onToggleOpen = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ref = useClickOutsideRef(onClose);

  const onInstallAndClose = useCallback<SearchResultsProps['onInstall']>(
    (name, version, type) => {
      onInstallNewDependency({ name, version }, type);
      setIsOpen(false);
    }, [onInstallNewDependency],
  );

  return (
    <Wrapper isOpen={isOpen} ref={ref}>
      <Button
        variant="primary"
        scale="small"
        icon="plus"
        onClick={onToggleOpen}
      >
        Search / Add
      </Button>
      <SearchForm
        onSubmit={(query) => onSearch(query)}
        searchResults={searchResults}
      />
      <TableContainer>
        {!!searchResults && searchResults.length > 0 && (
          <SearchResults searchResults={searchResults} onInstall={onInstallAndClose} />
        )}
      </TableContainer>
    </Wrapper>
  );
}
