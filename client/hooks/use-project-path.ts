import { useParams } from 'react-router-dom';

export const useProjectPath = (): string => {
  const { projectPathEncoded } = useParams<{ projectPathEncoded?: string }>();
  return projectPathEncoded || 'global';
};
