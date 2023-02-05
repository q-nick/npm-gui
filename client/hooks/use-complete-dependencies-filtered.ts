import { useTableFilter } from '../ui/Table/use-table-filter';
import { useBundleDetails } from './use-bundle-details';
import { useBundleScore } from './use-bundle-score';
import { useFastDependencies } from './use-fast-dependencies';
import { useFullDependencies } from './use-full-dependencies';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useCompleteDependenciesFiltered = (projectPath: string) => {
  const { dependencies: dependenciesFast, isError } =
    useFastDependencies(projectPath);

  // this are slow
  const { dependencies: dependenciesFull } = useFullDependencies(projectPath);

  // bind async bundle score
  const dependenciesScored = useBundleScore(
    dependenciesFull || dependenciesFast,
  );
  // bind async bundle details
  const dependencies = useBundleDetails(dependenciesScored);

  const {
    filters,
    setFilterValue,
    tableDataFiltered: dependenciesFiltered,
  } = useTableFilter(dependencies);

  return {
    dependencies,
    dependenciesFiltered,
    filters,
    setFilterValue,
    isError,
  };
};
