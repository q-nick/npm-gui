import Axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ScheduleContext } from '../../Schedule/ScheduleContext';
import { StoreContext } from '../../../app/StoreContext';

function getBasePathFor(projectPath?: string): string {
  if (projectPath) {
    return `/api/project/${projectPath}/dependencies`;
  }

  return 'api/global/dependencies';
}

export interface Hook {
  dependencies?: Dependency.Entire[];
  onInstallNewDependency: (
    dependency: Dependency.Basic, type: Dependency.Type
  ) => void;
  onInstallAllDependencies: () => void;
  onForceInstallAllDependencies: () => void;
}

export function useDependencies(projectPath: string): Hook {
  const { addToApiSchedule } = useContext(ScheduleContext);
  const { projects, setProjectDependencies } = useContext(StoreContext);

  // fetch function
  const fetchDependencies = useCallback(() => {
    addToApiSchedule({
      projectPath,
      description: `fetching dependencies`,
      executeMe: async () => {
        const responseSimple = await Axios.get<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/simple`);
        setProjectDependencies(projectPath, responseSimple.data);

        const responseFull = await Axios.get<Dependency.Entire[]>(`${getBasePathFor(projectPath)}`);
        setProjectDependencies(projectPath, responseFull.data);
      }
    });
  }, [projectPath]);

  // add new dependency
  const onInstallNewDependency = useCallback<Hook['onInstallNewDependency']>(
    (dependency, type) => {
      addToApiSchedule({
        projectPath,
        description: `installing ${dependency} as ${type}`,
        executeMe: async () => {
          const responseFull = await Axios
            .post<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/${type}/npm`, [dependency]);

          console.log(responseFull);
        }
      })
    }, [projectPath],
  );

  // install all dependencies
  const onInstallAllDependencies = useCallback<Hook['onInstallAllDependencies']>(
    () => {
      addToApiSchedule({
        projectPath,
        description: `installing all`,
        executeMe: async () => {
          await Axios.post<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/install`);
          fetchDependencies();
        }
      })
    }, [projectPath, fetchDependencies],
  );

  // force install all dependencies
  const onForceInstallAllDependencies = useCallback<Hook['onForceInstallAllDependencies']>(
    () => {
      addToApiSchedule({
        projectPath,
        description: `force install all`,
        executeMe: async () => {
          await Axios.post<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/install/force`);
          fetchDependencies();
        }
      })
    }, [projectPath, fetchDependencies],
  );

  // inital fetch
  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  return {
    dependencies: projects[projectPath] ? projects[projectPath].dependencies : [],
    onInstallNewDependency,
    onInstallAllDependencies,
    onForceInstallAllDependencies,
  };
}
