import type { VFC } from 'react';
import { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

import type { Basic, Type } from '../../../../../server/types/dependency.types';
import { useClickOutsideRef } from '../../../../hooks/use-click-outside';
import type { CSSType } from '../../../../Styled';
import { Button } from '../../../../ui/Button/Button';
import { ZERO } from '../../../../utils';
import { SearchForm } from './components/SearchForm';
import type { Props as SearchResultsProps } from './components/SearchResults';
import { SearchResults } from './components/SearchResults';
import { useSearch } from './hooks/use-search';

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

  ${({ isOpen }: { isOpen: boolean }): CSSType =>
    isOpen &&
    css`
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
  onInstallNewDependency: (dependency: Basic, type: Type) => void;
}

export const Search: VFC<Props> = ({ onInstallNewDependency }) => {
  const { searchResults, onSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);

  const onToggleOpen = useCallback(() => {
    setIsOpen((previousIsOpen) => !previousIsOpen);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ref = useClickOutsideRef(onClose);

  const onInstallAndClose = useCallback<SearchResultsProps['onInstall']>(
    (name, version, type) => {
      onInstallNewDependency({ name, version }, type);
      setIsOpen(false);
    },
    [onInstallNewDependency],
  );

  return (
    <Wrapper isOpen={isOpen} ref={ref}>
      <Button
        icon="plus"
        onClick={onToggleOpen}
        scale="small"
        variant="primary"
      >
        Search / Add
      </Button>

      <SearchForm
        onSubmit={(query): void => {
          void onSearch(query);
        }}
        searchResults={searchResults}
      />

      <TableContainer>
        {!!searchResults && searchResults.length > ZERO && (
          <SearchResults
            onInstall={onInstallAndClose}
            searchResults={searchResults}
          />
        )}
      </TableContainer>
    </Wrapper>
  );
};
