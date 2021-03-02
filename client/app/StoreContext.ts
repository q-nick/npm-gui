import { createContext, useCallback, useState } from 'react';
import type * as Dependency from '../../server/Dependency';

interface ProjectScope {
  dependencies: Dependency.Entire[];
}

interface Hook {
  projects: Record<string, ProjectScope>;
  addProject: (projectPath: string) => void;
  setProjectDependencies: (projectPath: string, dependencies: ProjectScope['dependencies']) => void;
}

const projectsFromStorage = localStorage.getItem('projects');
const initialProjects = projectsFromStorage !== null
  ? JSON.parse(projectsFromStorage) as Record<string, ProjectScope> : {};

function saveProjectsToLocalStorage(projects: Record<string, ProjectScope>): void {
  localStorage.setItem(
    'projects',
    JSON.stringify(Object.keys(projects)
      .reduce((prev, current) => ({ ...prev, [current]: { dependencies: [] } }), {})),
  );
}

export function useStoreContextValue(): Hook {
  const [projects, setProjects] = useState<Record<string, ProjectScope>>(initialProjects);

  const addProject = useCallback<Hook['addProject']>((projectPath) => {
    setProjects((prevProjects) => {
      const newProjects = {
        ...prevProjects,
        [projectPath]: { dependencies: [] },
      };
      saveProjectsToLocalStorage(newProjects);
      return newProjects;
    });
  }, []);

  const setProjectDependencies = useCallback<Hook['setProjectDependencies']>((projectPath, dependencies) => {
    setProjects((prevProjects) => ({
      ...prevProjects,
      [projectPath]: { dependencies },
    }));
  }, []);

  return {
    projects,
    addProject,
    setProjectDependencies,
  };
}

export const StoreContext = createContext<Hook>({
  projects: {},
  addProject() {},
  setProjectDependencies() {},
});
