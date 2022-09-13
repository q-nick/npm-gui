import type { ProjectScope } from './store.reducer';

const projectsFromStorage = localStorage.getItem('projects');

export const initialProjects =
  projectsFromStorage !== null
    ? (JSON.parse(projectsFromStorage) as Record<string, ProjectScope>)
    : {};

export const syncProjectsStorage = (
  projects: Record<string, ProjectScope>,
): void => {
  localStorage.setItem(
    'projects',
    JSON.stringify(
      Object.fromEntries(
        Object.keys(projects).map((current) => [
          current,
          { dependenciesProcessing: [] },
        ]),
      ),
    ),
  );
};
