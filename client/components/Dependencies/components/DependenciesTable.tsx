import styled, { css } from 'styled-components';
import { ThSortable, ThStyled } from '../../ThSortable/ThSortable';
import { DependencyRow } from './DependencyRow';
import { Loader } from '../../Loader';
import type * as Dependency from '../../../../server/types/Dependency';
import { useSortDependencies } from '../hooks/useSortDependencies';

interface Props {
  dependencies?: Dependency.Entire[];
  dependenciesProcessing: string[];
  onDeleteDependency: (dependency: Dependency.Entire) => void;
  onInstallDependencyVersion: (dependency: Dependency.Basic, type: Dependency.Type) => void;
  isGlobal: boolean;
  isEmpty: boolean;
  isLoading: boolean;
  filterTypeValue: Dependency.Type | 'any';
  filterNameValue: string;
  setFilterTypeValue: (value: Dependency.Type | 'any') => void;
  setFilterNameValue: (value: string) => void;
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
  dependencies,
  dependenciesProcessing,
  onDeleteDependency,
  onInstallDependencyVersion,
  isGlobal,
  filterTypeValue,
  setFilterTypeValue,
  filterNameValue,
  setFilterNameValue,
  isEmpty,
  isLoading,
}: Props): JSX.Element {
  const {
    dependenciesSorted, sort, sortReversed, onSortChange,
  } = useSortDependencies(dependencies);

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
            {!isGlobal && (
              <ThSortable<Dependency.Type | 'any'>
                appearance={headerEnvAppearance}
                filterOptions={['any', 'dev', 'prod']}
                filterType="select"
                filterValue={filterTypeValue}
                onClick={(): void => { onSortChange('type'); }}
                onFilterChange={setFilterTypeValue}
                sortActive={sort === 'type'}
                sortReversed={sortReversed}
              >
                Env
              </ThSortable>
            )}

            <ThSortable<string>
              appearance={headerNameAppearance}
              filterType="text"
              filterValue={filterNameValue}
              onClick={(): void => { onSortChange('name'); }}
              onFilterChange={setFilterNameValue}
              sortActive={sort === 'name'}
              sortReversed={sortReversed}
            >
              Name
            </ThSortable>

            <ThStyled appearance={columnVersionAppearance}>
              Size
            </ThStyled>

            {!isGlobal && (
              <ThSortable
                appearance={columnVersionAppearance}
                onClick={(): void => { onSortChange('required'); }}
                sortActive={sort === 'required'}
                sortReversed={sortReversed}
              >
                Required
              </ThSortable>
            )}

            <ThSortable
              appearance={columnVersionAppearance}
              onClick={(): void => { onSortChange('installed'); }}
              sortActive={sort === 'installed'}
              sortReversed={sortReversed}
            >
              Installed
            </ThSortable>

            <ThSortable
              appearance={columnVersionAppearance}
              onClick={(): void => { onSortChange('wanted'); }}
              sortActive={sort === 'wanted'}
              sortReversed={sortReversed}
            >
              Compatible
            </ThSortable>

            <ThSortable
              appearance={columnVersionAppearance}
              onClick={(): void => { onSortChange('latest'); }}
              sortActive={sort === 'latest'}
              sortReversed={sortReversed}
            >
              Latest
            </ThSortable>

            <ThStyled
              appearance={headerActionAppearance}
            />
          </tr>
        </thead>

        <tbody>
          {dependenciesSorted?.map((dependency) => (
            <DependencyRow
              key={dependency.name}
              dependency={dependency}
              isGlobal={isGlobal}
              isProcessing={dependenciesProcessing.includes(dependency.name)}
              onDeleteDependency={onDeleteDependency}
              onInstallDependencyVersion={onInstallDependencyVersion}
            />
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
}
