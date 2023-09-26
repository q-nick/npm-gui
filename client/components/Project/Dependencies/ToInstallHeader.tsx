import type { FC } from 'react';
import type React from 'react';
import { useCallback } from 'react';

import { useProjectStore } from '../../../app/ContextStore';
import { useFullDependencies } from '../../../hooks/use-full-dependencies';
import { useProjectPath } from '../../../hooks/use-project-path';
import { Button } from '../../../ui/Button/Button';
import { useTableFilter } from '../../../ui/Table/use-table-filter';
import { getNormalizedRequiredVersion } from '../../../utils';

interface Props {
  readonly version: 'installed' | 'latest' | 'wanted';
}

export const ToInstallHeader: FC<Props> = ({ version }) => {
  const projectPath = useProjectPath();
  const { dispatch, project } = useProjectStore(projectPath);

  const { dependencies } = useFullDependencies(projectPath);

  const { tableDataFiltered: dependenciesFiltered } =
    useTableFilter(dependencies);

  const dependenciesWithVersion = dependenciesFiltered?.filter(
    (dependency) =>
      dependency[version] &&
      dependency[version] !== getNormalizedRequiredVersion(dependency.required),
  );

  const allChecked = dependenciesWithVersion?.every((dep) => {
    return project?.dependenciesMutate?.[dep.name]?.required === dep[version];
  });

  const onCheck = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (dependenciesFiltered) {
        for (const dependency of dependenciesFiltered) {
          const v = dependency[version];
          if (v && getNormalizedRequiredVersion(dependency.required) !== v) {
            dispatch({
              action: 'mutateProjectDependency',
              projectPath,
              name: dependency.name,
              required: v,
              type: dependency.type,
              delete: null,
            });
          }
        }
      }
    },
    [dependenciesFiltered, dispatch, projectPath, version],
  );

  return (
    <>
      {version === 'wanted' ? 'compatible' : version} &nbsp;
      {dependenciesWithVersion && dependenciesWithVersion.length > 0 ? (
        <Button
          disabled={allChecked || project?.isBusy}
          icon="check"
          onClick={onCheck}
          title="Install project dependencies"
          variant="success"
        />
      ) : null}
    </>
  );
};
