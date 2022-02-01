import type { ResponserFunction } from '../../types/new-server.types';
import { requestGET } from '../../utils/request-with-promise';

interface Result {
  name: string;
  version: string;
  score: string;
  url: string;
  description: string;
}

interface NPMApiResult {
  results: {
    package: {
      name: string;
      description: string;
      version: string;
      links: {
        repository: string;
      };
    };
    score: {
      final: string;
    };
  }[];
}

// eslint-disable-next-line func-style
async function searchNPM(query: string): Promise<Result[]> {
  const response = await requestGET(
    'api.npms.io',
    `/v2/search?from=0&size=25&q=${query}`,
  );
  console.log('XXXXXXXXXXXXXXXXXXXXX', response);
  return (JSON.parse(response) as NPMApiResult).results.map((result) => ({
    name: result.package.name,
    version: result.package.version,
    score: result.score.final,
    url: result.package.links.repository,
    description: result.package.description,
  }));
}

export const search: ResponserFunction<{ query: string }> = async ({
  body: { query },
}) => {
  const results = await searchNPM(query);
  return results;
};
