import * as React from 'react';
import styled, { css } from 'styled-components';
import { ThSortable, ThStyled } from '../../ThSortable/ThSortable';
import { DependencyRow } from './DependencyRow';
import { Loader } from '../../Loader/Loader';

interface Props {
  sortKey: string;
  sortReversed: boolean;
  filters: { [key:string] : string };
  filtersEnabled?: ('name' | 'type')[];
  dependencies: Dependency.Entire[];
  dependenciesProcessing: Record<string, boolean>;
  onDeleteDependency: (dependency: Dependency.Entire) => void;
  onInstallDependencyVersion: (dependency: Dependency.Entire, version: string) => void;
  onSortChange: (sortKey: string) => void;
  onFilterChange: (filterName: string, filterValue: string) => void;
}

const Wrapper = styled.div`
  border: 1px solid #dfd7ca;
  border-radius: 2px;
  margin-top: 15px;
  flex: 1;
  position: relative;
  overflow-y: scroll;
`;

const Info = styled.div`
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  pointer-events: none;
`;

const columnVersionAppearance = css`
  width: 10%;
  min-width: 80px;
`;

const headerEnvAppearance = css`
  width: 100px;
`;

const headerActionAppearance = css`
  width: 30px;
`;

const headerNameAppearance = css`
  text-align: left;
  padding-left: 5px;
`;

export function DependenciesTable({
  sortKey,
  sortReversed,
  onSortChange,
  filters,
  filtersEnabled,
  onFilterChange,
  dependencies,
  dependenciesProcessing,
  onDeleteDependency,
  onInstallDependencyVersion,
}:Props): JSX.Element {
  const isEmpty = dependencies && dependencies.length === 0;
  const isLoading = !dependencies;

  const ths = React.useMemo(() => [
    {
      name: 'Env',
      sortMatch: 'type',
      appearance: headerEnvAppearance,
      filter: filtersEnabled && filtersEnabled.includes('type') && {
        type: 'select',
        value: filters.type,
        options: ['dev', 'prod'],
      },
    },
    {
      name: 'Name',
      sortMatch: 'name',
      appearance: headerNameAppearance,
      filter: {
        type: 'text', value: filters.name,
      },
    },
    // { name: 'Nsp' },
    { name: 'Required', sortMatch: 'required', appearance: columnVersionAppearance },
    { name: 'Installed', sortMatch: 'installed', appearance: columnVersionAppearance },
    { name: 'Wanted', sortMatch: 'wanted', appearance: columnVersionAppearance },
    { name: 'Latest', sortMatch: 'latest', appearance: columnVersionAppearance },
    { name: '', appearance: headerActionAppearance },
  ], [filters, filtersEnabled]);

  return (
    <Wrapper>
      <Info>
        {isEmpty && <>empty...</>}
        {isLoading && (
          <>
            <Loader />
            &nbsp;loading...
          </>
        )}
      </Info>
      <table>
        <thead>
          <tr>
            {ths.map((th) => (
              <React.Fragment key={th.name}>
                {
                  th.sortMatch ? (
                    <ThSortable
                      appearance={th.appearance}
                      filter={th.filter as any}
                      sortMatch={th.sortMatch}
                      sortKey={sortKey}
                      sortReversed={sortReversed}
                      onSortChange={onSortChange}
                      onFilterChange={onFilterChange}
                    >
                      {th.name}
                    </ThSortable>
                  ) : <ThStyled appearance={th.appearance}>{th.name}</ThStyled>
                  }
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {dependencies && dependencies.map((dependency) => (
            <DependencyRow
              key={dependency.name}
              dependency={dependency}
              isProcessing={dependenciesProcessing[dependency.name]}
              onDeleteDependency={onDeleteDependency}
              onInstallDependencyVersion={onInstallDependencyVersion}
            />
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
}
