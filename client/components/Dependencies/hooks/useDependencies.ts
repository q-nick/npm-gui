import Axios from 'axios';
import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { ScheduleContext } from '../../Schedule/ScheduleContext';
import { StoreContext } from '../../../app/StoreContext';
import type * as Dependency from '../../../../server/types/Dependency';
import { getNormalizedRequiredVersion, ZERO } from '../../../utils';

function getBasePathFor(projectPath: string): string {
  if (projectPath !== 'global') {
    return `/api/project/${projectPath}/dependencies`;
  }

  return 'api/global/dependencies';
}

export interface Hook {
  dependencies?: Dependency.Entire[];
  dependenciesProcessing: Record<string, boolean | undefined>;
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
  const [
    dependenciesProcessing,
    setDependenciesProcessing,
  ] = useState<Record<string, boolean | undefined>>({});

  const setDependenciesProcessingFromArr = useCallback(
    (deps: { name: string }[], value: boolean) => {
      const depsProcessing = deps.reduce<Record<string, boolean>>((prev, dependency) => ({
        ...prev,
        [dependency.name]: value,
      }), {});
      setDependenciesProcessing(depsProcessing);
    }, [],
  );

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

        setDependenciesProcessingFromArr(responseSimple.data, true);

        const responseFull = await Axios.get<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/full`);
        setProjectDependencies(projectPath, responseFull.data);

        setDependenciesProcessingFromArr(responseSimple.data, false);
      },
    });
  }, [setProjectDependencies, addToApiSchedule, setDependenciesProcessingFromArr, projectPath]);

  // add new dependency
  const onInstallNewDependency = useCallback<Hook['onInstallNewDependency']>(
    (dependency, type) => {
      addToApiSchedule({
        projectPath,
        description: `installing ${dependency.name} as ${type}`,
        executeMe: async () => {
          setDependenciesProcessing({ [dependency.name]: true });
          await Axios.post<Dependency.Entire[]>(`${getBasePathFor(projectPath)}/${type}`, [dependency]);
          setDependenciesProcessing({ [dependency.name]: false });
        },
      });
    }, [addToApiSchedule, projectPath],
  );

  // delete dependency
  const onDeleteDependency = useCallback<Hook['onDeleteDependency']>(
    (dependency) => {
      addToApiSchedule({
        projectPath,
        description: `deleting ${dependency.name} as ${dependency.type!}`,
        executeMe: async () => {
          setDependenciesProcessing({ [dependency.name]: true });
          await Axios.delete(`${getBasePathFor(projectPath)}/${dependency.type!}/${dependency.name}`);
          setDependenciesProcessing({ [dependency.name]: false });
          fetchDependencies();
        },
      });
    }, [addToApiSchedule, projectPath, fetchDependencies],
  );

  // install all dependencies
  const onInstallAllDependencies = useCallback<Hook['onInstallAllDependencies']>(
    (force) => {
      if (!dependencies) { return; }

      addToApiSchedule({
        projectPath,
        description: `${force === true ? 'force' : ''} installing all`,
        executeMe: async () => {
          setDependenciesProcessingFromArr(dependencies, true);
          await Axios.post(`${getBasePathFor(projectPath)}/install${force === true ? '/force' : ''}`);
          setDependenciesProcessingFromArr(dependencies, true);
          fetchDependencies();
        },
      });
    }, [
      addToApiSchedule,
      projectPath,
      dependencies,
      fetchDependencies,
      setDependenciesProcessingFromArr],
  );

  // install specific dependencies versions
  const onUpdateDependencies = useCallback<Hook['onUpdateDependencies']>(
    (versionType) => {
      if (!dependencies) { return; }
      const dependenciesToUpdate = dependencies
        .filter((dependency) => typeof dependency[versionType] === 'string'
          && dependency[versionType] !== getNormalizedRequiredVersion(dependency.required))
        .map((dependency) => ({
          name: dependency.name,
          version: dependency[versionType],
          type: dependency.type,
        }));

      if (dependenciesToUpdate.length === ZERO) {
        return;
      }

      const dependenciesToUpdateDev = dependenciesToUpdate.filter((d) => d.type === 'dev');
      const dependenciesToUpdateProd = dependenciesToUpdate.filter((d) => d.type === 'prod');

      addToApiSchedule({
        projectPath,
        description: `updating dependencies to ${versionType}`,
        executeMe: async () => {
          setDependenciesProcessingFromArr(dependenciesToUpdate, true);

          await Axios.post(`${getBasePathFor(projectPath)}/dev`, dependenciesToUpdateDev);
          await Axios.post(`${getBasePathFor(projectPath)}/prod`, dependenciesToUpdateProd);

          setDependenciesProcessingFromArr(dependenciesToUpdate, true);
          fetchDependencies();
        },
      });
    }, [
      addToApiSchedule, setDependenciesProcessingFromArr,
      projectPath, dependencies, fetchDependencies,
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
