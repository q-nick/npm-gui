export const getBasePathFor = (projectPath: string): string => {
  if (projectPath !== 'global') {
    return `/api/project/${projectPath}/dependencies`;
  }

  return 'api/global/dependencies';
};

export const fetchJSON = async <T>(
  ...parameters: Parameters<typeof fetch>
): Promise<T> => {
  const response = await fetch(...parameters);

  if (!response.ok) {
    throw new Error('Request Error');
  }

  return response.json();
};
