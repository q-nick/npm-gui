import styled, { css } from 'styled-components';
import { useCallback, useState } from 'react';
import { ThSortable, ThStyled } from '../../ThSortable/ThSortable';
import { DependencyRow } from './DependencyRow';
import { Loader } from '../../Loader';
import type * as Dependency from '../../../../server/types/Dependency';
import { ZERO } from '../../../utils';

interface Props {
  dependencies?: Dependency.Entire[];
  dependenciesProcessing: Record<string, boolean | undefined>;
  onDeleteDependency: (dependency: Dependency.Entire) => void;
  onInstallDependencyVersion: (dependency: Dependency.Entire, version: string) => void;
  isGlobal: boolean;
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
}: Props): JSX.Element {
  const [sort, setSort] = useState<string | undefined>();
  const [sortReversed, setSortReversed] = useState(false);
  const [filterTypeValue, setFilterTypeValue] = useState<Dependency.Type | undefined>(undefined);
  const [filterNameValue, setFilterNameValue] = useState<string>('');
  const isEmpty = !!dependencies && dependencies.length === ZERO;
  const isLoading = !dependencies;

  const onSortChange = useCallback((sortName: string) => {
    if (sort === sortName) {
      setSortReversed((v) => !v);
    } else {
      setSortReversed(false);
      setSort(sortName);
    }
  }, [sort]);

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
              <ThSortable<Dependency.Type>
                appearance={headerEnvAppearance}
                filterOptions={['dev', 'prod']}
                filterType="select"
                filterValue={filterTypeValue}
                onClick={(): void => { onSortChange('env'); }}
                onFilterChange={setFilterTypeValue}
                sortActive={sort === 'env'}
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
              Wanted
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
          {dependencies?.map((dependency) => (
            <DependencyRow
              key={dependency.name}
              dependency={dependency}
              isGlobal={isGlobal}
              isProcessing={dependenciesProcessing[dependency.name] === true}
              onDeleteDependency={onDeleteDependency}
              onInstallDependencyVersion={onInstallDependencyVersion}
            />
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
}
