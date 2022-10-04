import styled, { css } from 'styled-components';

import type {
  Basic,
  DependencyInstalledExtras,
  Type,
} from '../../../../server/types/dependency.types';
import { Loader } from '../../Loader';
import { useSortDependencies } from '../hooks/use-sort-dependencies';
import { DependencyRow } from './DependencyRow';
import { ThSortable, ThStyled } from './ThSortable/ThSortable';

interface Props {
  dependencies?: DependencyInstalledExtras[];
  dependenciesProcessing: string[];
  onDeleteDependency: (dependency: Basic) => void;
  onInstallDependencyVersion: (dependency: Basic, type: Type) => void;
  isGlobal: boolean;
  isEmpty: boolean;
  isLoading: boolean;
  filterTypeValue: Type | 'any';
  filterNameValue: string;
  setFilterTypeValue: (value: Type | 'any') => void;
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

const headerEnvironmentAppearance = css`
  width: 100px;
`;

const headerActionAppearance = css`
  width: 30px;
`;

const headerNameAppearance = css`
  text-align: left;
  padding-left: 5px;
`;

const hasTypesNext = (
  dependencies: DependencyInstalledExtras[],
  index: number,
  name: string,
): boolean => {
  const nextDep = dependencies[index + 1];

  return !!(nextDep && nextDep.name.replace('@types/', '') === name);
};

const isTypesNext = (
  dependencies: DependencyInstalledExtras[],
  index: number,
  name: string,
): boolean => {
  const previousDep = dependencies[index - 1];
  return !!(previousDep && previousDep.name === name.replace('@types/', ''));
};

export const DependenciesTable: React.FC<Props> = ({
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
}) => {
  const { dependenciesSorted, sort, sortReversed, onSortChange } =
    useSortDependencies(dependencies);

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
              <ThSortable<Type | 'any'>
                appearance={headerEnvironmentAppearance}
                filterOptions={['any', 'dev', 'prod']}
                filterType="select"
                filterValue={filterTypeValue}
                onClick={(): void => {
                  onSortChange('type');
                }}
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
              onClick={(): void => {
                onSortChange('name');
              }}
              onFilterChange={setFilterNameValue}
              sortActive={sort === 'name'}
              sortReversed={!sortReversed}
            >
              Name
            </ThSortable>

            <ThSortable
              appearance={columnVersionAppearance}
              onClick={(): void => {
                onSortChange('score');
              }}
              sortActive={sort === 'score'}
              sortReversed={!sortReversed}
            >
              Score
            </ThSortable>

            <ThSortable
              appearance={columnVersionAppearance}
              onClick={(): void => {
                onSortChange('size');
              }}
              sortActive={sort === 'size'}
              sortReversed={!sortReversed}
            >
              Size
            </ThSortable>

            <ThSortable
              appearance={columnVersionAppearance}
              onClick={(): void => {
                onSortChange('updated');
              }}
              sortActive={sort === 'updated'}
              sortReversed={!sortReversed}
            >
              Updated
            </ThSortable>

            {!isGlobal && (
              <ThSortable
                appearance={columnVersionAppearance}
                onClick={(): void => {
                  onSortChange('required');
                }}
                sortActive={sort === 'required'}
                sortReversed={sortReversed}
              >
                Required
              </ThSortable>
            )}

            <ThSortable
              appearance={columnVersionAppearance}
              onClick={(): void => {
                onSortChange('installed');
              }}
              sortActive={sort === 'installed'}
              sortReversed={sortReversed}
            >
              Installed
            </ThSortable>

            <ThSortable
              appearance={columnVersionAppearance}
              onClick={(): void => {
                onSortChange('wanted');
              }}
              sortActive={sort === 'wanted'}
              sortReversed={sortReversed}
            >
              Compatible
            </ThSortable>

            <ThSortable
              appearance={columnVersionAppearance}
              onClick={(): void => {
                onSortChange('latest');
              }}
              sortActive={sort === 'latest'}
              sortReversed={sortReversed}
            >
              Latest
            </ThSortable>

            <ThStyled appearance={headerActionAppearance} />
          </tr>
        </thead>

        <tbody>
          {dependenciesSorted?.map((dependency, index) => (
            <DependencyRow
              dependency={dependency}
              hasTypesBelow={hasTypesNext(
                dependenciesSorted,
                index,
                dependency.name,
              )}
              isGlobal={isGlobal}
              isProcessing={dependenciesProcessing.includes(dependency.name)}
              isTypesBelow={isTypesNext(
                dependenciesSorted,
                index,
                dependency.name,
              )}
              key={dependency.name}
              onDeleteDependency={onDeleteDependency}
              onInstallDependencyVersion={onInstallDependencyVersion}
            />
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
};
