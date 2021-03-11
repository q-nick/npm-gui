import { createContext, useCallback, useState } from 'react';
import type * as Dependency from '../../server/types/Dependency';

interface ProjectScope {
  dependencies?: Dependency.Entire[];
  dependenciesProcessing: string[];
}

interface Hook {
  projects: Record<string, ProjectScope>;
  addProject: (projectPath: string) => void;
  setProjectDependencies: (projectPath: string, dependencies: ProjectScope['dependencies']) => void;
  updateProjectDepsProcessing: (projectPath: string, dependencies: ProjectScope['dependenciesProcessing'], value: boolean) => void;
}

const projectsFromStorage = localStorage.getItem('projects');
const initialProjects = projectsFromStorage !== null
  ? JSON.parse(projectsFromStorage) as Record<string, ProjectScope> : {};

function saveProjectsToLocalStorage(projects: Record<string, ProjectScope>): void {
  localStorage.setItem(
    'projects',
    JSON.stringify(Object.keys(projects)
      .reduce((prev, current) => ({
        ...prev,
        [current]: {},
      }),
      {})),
  );
}

export function useStoreContextValue(): Hook {
  const [projects, setProjects] = useState<Record<string, ProjectScope>>(initialProjects);

  const addProject = useCallback<Hook['addProject']>((projectPath) => {
    setProjects((prevProjects) => {
      const newProjects = {
        ...prevProjects,
        [projectPath]: { dependenciesProcessing: [] },
      };
      saveProjectsToLocalStorage(newProjects);
      return newProjects;
    });
  }, []);

  const setProjectDependencies = useCallback<Hook['setProjectDependencies']>((projectPath, dependencies) => {
    setProjects((prevProjects) => ({
      ...prevProjects,
      [projectPath]: {
        dependenciesProcessing: prevProjects[projectPath]?.dependenciesProcessing ?? [],
        dependencies,
      },
    }));
  }, []);

  const updateProjectDepsProcessing = useCallback<Hook['updateProjectDepsProcessing']>(
    (projectPath, dependenciesToUpdate, value) => {
      setProjects((prevProjects) => {
        const project = prevProjects[projectPath] ?? { dependenciesProcessing: [] };
        const dependenciesProcessing = value
          ? [...project.dependenciesProcessing, ...dependenciesToUpdate]
          : project.dependenciesProcessing.filter((d) => !dependenciesToUpdate.includes(d));

        return {
          ...prevProjects,
          [projectPath]: {
            ...prevProjects[projectPath],
            dependenciesProcessing,
          },
        };
      });
    }, [],
  );

  return {
    projects,
    addProject,
    setProjectDependencies,
    updateProjectDepsProcessing,
  };
}

export const StoreContext = createContext<Hook>({
  projects: {},
  addProject() {},
  setProjectDependencies() {},
  updateProjectDepsProcessing() {},
});
