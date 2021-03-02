import Axios from 'axios';
import {
  useCallback, useContext, useEffect, useMemo,
} from 'react';
import { ScheduleContext } from '../../Schedule/ScheduleContext';
import { StoreContext } from '../../../app/StoreContext';
import type * as Dependency from '../../../../server/Dependency';
import { getNormalizedRequiredVersion, ZERO } from '../../../utils';

function getBasePathFor(projectPath?: string): string {
  if (projectPath !== undefined) {
    return `/api/project/${projectPath}/dependencies`;
  }

  return 'api/global/dependencies';
}
export interface Hook {
  dependencies?: Dependency.Entire[];
  onInstallNewDependency: (
    dependency: Dependency.Basic, type: Dependency.Type
  ) => void;
  onInstallAllDependencies: (force? : boolean) => void;
  onUpdateDependencies: (versionType: 'installed' | 'latest' | 'wanted') => void;
  onDeleteDependency: (
    dependency: Dependency.Basic
  ) => void;
}

export function useDependencies(projectPath: string): Hook {
  const { addToApiSchedule } = useContext(ScheduleContext);
  const { projects, setProjectDependencies } = useContext(StoreContext);

  const project = projects[projectPath];
  const dependencies = useMemo(() => (
    project ? project.dependencies : []
  ), [project]);

  // fetch function
  const fetchDependencies = useCallback(() => {
    addToApiSchedule({
      projectPath,
      description: 'fetching dependencies',
      executeMe: async () => {
        const responseSimple = await Axios.get<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/simple`);
        setProjectDependencies(projectPath, responseSimple.data);

        const responseFull = await Axios.get<Dependency.Entire[]>(`${getBasePathFor(projectPath)}`);
        setProjectDependencies(projectPath, responseFull.data);
      },
    });
  }, [setProjectDependencies, addToApiSchedule, projectPath]);

  // add new dependency
  const onInstallNewDependency = useCallback<Hook['onInstallNewDependency']>(
    (dependency, type) => {
      addToApiSchedule({
        projectPath,
        description: `installing ${dependency.name} as ${type}`,
        executeMe: async () => {
          const responseFull = await Axios
            .post<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/${type}`, [dependency]);

          console.log(responseFull);
        },
      });
    }, [addToApiSchedule, projectPath],
  );

  // delete dependency
  const onDeleteDependency = useCallback<Hook['onDeleteDependency']>(
    (dependency) => {
      addToApiSchedule({
        projectPath,
        description: `deleting ${dependency.name} as ${dependency.type ?? ''}`,
        executeMe: async () => {
          const responseFull = await Axios
            .delete(`${getBasePathFor(projectPath)}/${dependency.type ?? ''}/${dependency.name}`);

          console.log(responseFull);
        },
      });
    }, [addToApiSchedule, projectPath],
  );

  // install all dependencies
  const onInstallAllDependencies = useCallback<Hook['onInstallAllDependencies']>(
    (force) => {
      addToApiSchedule({
        projectPath,
        description: `${force === true ? 'force' : ''} installing all`,
        executeMe: async () => {
          await Axios.post(`${getBasePathFor(projectPath)}/install${force === true ? '/force' : ''}`);
          fetchDependencies();
        },
      });
    }, [addToApiSchedule, projectPath, fetchDependencies],
  );

  // install specific dependencies versions
  const onUpdateDependencies = useCallback<Hook['onUpdateDependencies']>(
    (versionType) => {
      const dependenciesToUpdate = dependencies
        .filter((dependency) => dependency[versionType] !== undefined
          && dependency[versionType] !== getNormalizedRequiredVersion(dependency.required))
        .map((dependency) => ({ name: dependency.name, version: dependency[versionType] }));

      if (dependenciesToUpdate.length === ZERO) {
        return;
      }

      addToApiSchedule({
        projectPath,
        description: `updating dependencies to ${versionType}`,
        executeMe: async () => {
          await Axios.post(getBasePathFor(projectPath), dependenciesToUpdate);
          fetchDependencies();
        },
      });
    }, [addToApiSchedule, projectPath, dependencies, fetchDependencies],
  );

  // inital fetch
  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  return {
    dependencies,
    onInstallNewDependency,
    onInstallAllDependencies,
    onDeleteDependency,
    onUpdateDependencies,
  };
}
