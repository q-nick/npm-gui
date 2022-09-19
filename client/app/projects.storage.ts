const projectsFromStorage = localStorage.getItem('projects');

export const initialProjects =
  projectsFromStorage !== null
    ? Object.keys(JSON.parse(projectsFromStorage) as Record<string, unknown>)
    : [];

export const syncProjectsStorage = (projects: string[]): void => {
  localStorage.setItem(
    'projects',
    JSON.stringify(Object.fromEntries(projects.map((current) => [current]))),
  );
};
