import Axios from 'axios';
import {
  useCallback, useContext, useEffect, useMemo,
} from 'react';
import { ScheduleContext } from '../../Schedule/ScheduleContext';
import { StoreContext } from '../../../app/StoreContext';
import type * as Dependency from '../../../../server/types/Dependency';
import { ZERO } from '../../../utils';

function getBasePathFor(projectPath: string): string {
  if (projectPath !== 'global') {
    return `/api/project/${projectPath}/dependencies`;
  }

  return 'api/global/dependencies';
}

export interface Hook {
  dependencies?: Dependency.Entire[];
  dependenciesProcessing: string[];
  onInstallNewDependency: (
    dependency: Dependency.Basic, type: Dependency.Type
  ) => void;
  onInstallAllDependencies: (force? : boolean) => void;
  onUpdateDependencies: (dependencies: Dependency.Basic[]) => void;
  onDeleteDependency: (
    dependency: Dependency.Basic
  ) => void;
}

export function useDependencies(projectPath: string): Hook {
  const { addToApiSchedule } = useContext(ScheduleContext);
  const {
    projects, setProjectDependencies, updateProjectDepsProcessing,
  } = useContext(StoreContext);

  const project = projects[projectPath];
  const dependencies = useMemo(() => (
    project ? project.dependencies : []
  ), [project]);
  const dependenciesProcessing = useMemo(() => (
    project ? project.dependenciesProcessing : []
  ), [project]);

  // fetch function
  const fetchDependencies = useCallback((instantSchedule?: boolean) => {
    addToApiSchedule({
      instantSchedule,
      projectPath,
      description: 'fetching dependencies',
      executeMe: async () => {
        const responseSimple = await Axios.get<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/simple`);
        setProjectDependencies(projectPath, responseSimple.data);

        updateProjectDepsProcessing(projectPath, responseSimple.data.map((d) => d.name), true);

        const responseFull = await Axios.get<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/full`);
        setProjectDependencies(projectPath, responseFull.data);

        updateProjectDepsProcessing(projectPath, responseSimple.data.map((d) => d.name), false);
      },
    });
  }, [setProjectDependencies, updateProjectDepsProcessing, addToApiSchedule, projectPath]);

  // add new dependency
  const onInstallNewDependency = useCallback<Hook['onInstallNewDependency']>(
    (dependency, type) => {
      updateProjectDepsProcessing(projectPath, [dependency.name], true);
      addToApiSchedule({
        projectPath,
        description: `installing ${dependency.name} as ${type}`,
        executeMe: async () => {
          updateProjectDepsProcessing(projectPath, [dependency.name], true);
          await Axios.post<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/${type}`, [dependency]);
          fetchDependencies();
        },
      });
    }, [addToApiSchedule, fetchDependencies, updateProjectDepsProcessing, projectPath],
  );

  // delete dependency
  const onDeleteDependency = useCallback<Hook['onDeleteDependency']>(
    (dependency) => {
      updateProjectDepsProcessing(projectPath, [dependency.name], true);
      addToApiSchedule({
        projectPath, // eslint-disable-next-line
        description: `deleting ${dependency.name} as ${dependency.type!}`,
        executeMe: async () => {
          updateProjectDepsProcessing(projectPath, [dependency.name], true);
          // eslint-disable-next-line
          await Axios.delete(`${getBasePathFor(projectPath)}/${dependency.type!}/${dependency.name}`);
          fetchDependencies();
        },
      });
    }, [addToApiSchedule, projectPath, fetchDependencies, updateProjectDepsProcessing],
  );

  // install all dependencies
  const onInstallAllDependencies = useCallback<Hook['onInstallAllDependencies']>(
    (force) => {
      if (!dependencies) { return; }
      updateProjectDepsProcessing(projectPath, dependencies.map((d) => d.name), true);
      addToApiSchedule({
        projectPath,
        description: `${force === true ? 'force' : ''} installing all`,
        executeMe: async () => {
          updateProjectDepsProcessing(projectPath, dependencies.map((d) => d.name), true);
          await Axios.post(`${getBasePathFor(projectPath)}/install${force === true ? '/force' : ''}`);
          fetchDependencies();
        },
      });
    }, [
      addToApiSchedule,
      projectPath,
      dependencies,
      fetchDependencies,
      updateProjectDepsProcessing,
    ],
  );

  // install specific dependencies versions
  const onUpdateDependencies = useCallback<Hook['onUpdateDependencies']>(
    (dependenciesToUpdate) => {
      if (dependenciesToUpdate.length === ZERO) {
        return;
      }
      updateProjectDepsProcessing(projectPath, dependenciesToUpdate.map((d) => d.name), true);

      const dependenciesToUpdateDev = dependenciesToUpdate.filter((d) => d.type === 'dev');
      const dependenciesToUpdateProd = dependenciesToUpdate.filter((d) => d.type === 'prod');

      addToApiSchedule({
        projectPath,
        description: 'updating dependencies',
        executeMe: async () => {
          updateProjectDepsProcessing(projectPath, dependenciesToUpdate.map((d) => d.name), true);

          await Axios.post(`${getBasePathFor(projectPath)}/dev`, dependenciesToUpdateDev);
          await Axios.post(`${getBasePathFor(projectPath)}/prod`, dependenciesToUpdateProd);

          fetchDependencies();
        },
      });
    }, [
      addToApiSchedule, updateProjectDepsProcessing,
      projectPath, fetchDependencies,
    ],
  );

  // inital fetch
  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  return {
    dependencies,
    dependenciesProcessing,
    onInstallNewDependency,
    onInstallAllDependencies,
    onDeleteDependency,
    onUpdateDependencies,
  };
}
