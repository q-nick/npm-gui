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

const fetchQueue: (() => Promise<unknown>)[] = [];
let fetchQueueActive = 0;

export const fetchQueuedJSON = async <T>(
  ...parameters: Parameters<typeof fetch>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const job = async (): Promise<void> => {
      const response = await fetch(...parameters);

      if (!response.ok) {
        reject(new Error('Request Error'));
      }

      resolve(response.json());
    };

    fetchQueue.push(job);
  });
};

setInterval(async () => {
  // eslint-disable-next-line no-unmodified-loop-condition
  while (fetchQueueActive < 10 && fetchQueue.length > 0) {
    const job = fetchQueue.shift();
    if (job) {
      fetchQueueActive += 1;
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      job().finally(() => (fetchQueueActive -= 1));
    }
  }
}, 100);
