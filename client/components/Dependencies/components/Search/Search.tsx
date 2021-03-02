import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { useClickOutsideRef } from '../../../../hooks/useClickOutside';
import { Button } from '../../../../ui/Button/Button';
import { SearchForm } from './components/SearchForm';
import type { Props as SearchResultsProps } from './components/SearchResults';
import { SearchResults } from './components/SearchResults';
import { useSearch } from './hooks/useSearch';
import type * as Dependency from '../../../../../server/Dependency';
import type { CSSType } from '../../../../Styled';
import { ZERO } from '../../../../utils';

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

  ${({ isOpen }: { isOpen: boolean }): CSSType => isOpen && css`
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

interface Props {
  onInstallNewDependency: (dependency: Dependency.Basic, type: Dependency.Type) => void;
}

export function Search({ onInstallNewDependency }: Props): JSX.Element {
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
    <Wrapper ref={ref} isOpen={isOpen}>
      <Button
        icon="plus"
        onClick={onToggleOpen}
        scale="small"
        variant="primary"
      >
        Search / Add
      </Button>

      <SearchForm
        onSubmit={(query): void => { void onSearch(query); }}
        searchResults={searchResults}
      />

      <TableContainer>
        {!!searchResults && searchResults.length > ZERO && (
          <SearchResults onInstall={onInstallAndClose} searchResults={searchResults} />
        )}
      </TableContainer>
    </Wrapper>
  );
}
