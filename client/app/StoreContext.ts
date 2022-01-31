import { createContext, useCallback, useState } from 'react';

import type { Entire } from '../../server/types/Dependency';

interface ProjectScope {
  dependencies?: Entire[];
  dependenciesProcessing: string[];
}

interface Hook {
  projects: Record<string, ProjectScope>;
  addProject: (projectPath: string) => void;
  setProjectDependencies: (
    projectPath: string,
    dependencies: ProjectScope['dependencies'],
  ) => void;
  updateProjectDepsProcessing: (
    projectPath: string,
    dependencies: ProjectScope['dependenciesProcessing'],
    value: boolean,
  ) => void;
}

const projectsFromStorage = localStorage.getItem('projects');
const initialProjects =
  projectsFromStorage !== null
    ? (JSON.parse(projectsFromStorage) as Record<string, ProjectScope>)
    : {};

const saveProjectsToLocalStorage = (
  projects: Record<string, ProjectScope>,
): void => {
  localStorage.setItem(
    'projects',
    JSON.stringify(
      Object.fromEntries(Object.keys(projects).map((current) => [current, {}])),
    ),
  );
};

export const useStoreContextValue = (): Hook => {
  const [projects, setProjects] =
    useState<Record<string, ProjectScope>>(initialProjects);

  const addProject = useCallback<Hook['addProject']>((projectPath) => {
    setProjects((previousProjects) => {
      const newProjects = {
        ...previousProjects,
        [projectPath]: { dependenciesProcessing: [] },
      };
      saveProjectsToLocalStorage(newProjects);
      return newProjects;
    });
  }, []);

  const setProjectDependencies = useCallback<Hook['setProjectDependencies']>(
    (projectPath, dependencies) => {
      setProjects((previousProjects) => ({
        ...previousProjects,
        [projectPath]: {
          dependenciesProcessing:
            previousProjects[projectPath]?.dependenciesProcessing ?? [],
          dependencies,
        },
      }));
    },
    [],
  );

  const updateProjectDepsProcessing = useCallback<
    Hook['updateProjectDepsProcessing']
  >((projectPath, dependenciesToUpdate, value) => {
    setProjects((previousProjects) => {
      const project = previousProjects[projectPath] ?? {
        dependenciesProcessing: [],
      };
      const dependenciesProcessing = value
        ? [...project.dependenciesProcessing, ...dependenciesToUpdate]
        : project.dependenciesProcessing.filter(
            (d) => !dependenciesToUpdate.includes(d),
          );

      return {
        ...previousProjects,
        [projectPath]: {
          ...previousProjects[projectPath],
          dependenciesProcessing,
        },
      };
    });
  }, []);

  return {
    projects,
    addProject,
    setProjectDependencies,
    updateProjectDepsProcessing,
  };
};

export const StoreContext = createContext<Hook>({
  projects: {},
  addProject() {},
  setProjectDependencies() {},
  updateProjectDepsProcessing() {},
});
