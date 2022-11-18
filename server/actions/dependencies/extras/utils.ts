export const getChunks = <T>(array: T[], chunkSize = 10): T[][] => {
  const chunks: T[][] = [];

  for (let index = 0; index < array.length; index += chunkSize) {
    const chunk = array.slice(index, index + chunkSize);
    // do whatever
    chunks.push(chunk);
  }

  return chunks;
};
