// eslint-disable-next-line max-statements
export const timeSince = (date: number): string => {
  const seconds = Math.floor((Date.now() - date) / 1000);

  let interval = seconds / 31_536_000;

  if (interval > 1) {
    return `${Math.floor(interval)} years`;
  }
  interval = seconds / 2_592_000;
  if (interval > 1) {
    return `${Math.floor(interval)} months`;
  }
  interval = seconds / 86_400;
  if (interval > 1) {
    return `${Math.floor(interval)} days`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
};

export const normalizeRepositoryLink = (link?: string): string | undefined =>
  link
    ?.replace('git+', '')
    .replace('git://', 'https://')
    .replace('ssh://', 'https://')
    .replace('.git', '');
