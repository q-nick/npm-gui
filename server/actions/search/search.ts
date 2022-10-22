import type { SearchResponse } from '../../types/global.types';
import type { ResponserFunction } from '../../types/new-server.types';
import { parseJSON } from '../../utils/parse-json';
import { requestGET } from '../../utils/request-with-promise';

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

export const search: ResponserFunction<
  { query: string },
  unknown,
  SearchResponse
> = async ({ body: { query } }) => {
  const response = await requestGET(
    'api.npms.io',
    `/v2/search?from=0&size=25&q=${query}`,
  );

  const parsed = parseJSON<NPMApiResult>(response);
  if (!parsed) {
    throw new Error('Unable to get pacakege info');
  }

  return parsed.results.map((result) => ({
    name: result.package.name,
    version: result.package.version,
    score: result.score.final,
    url: result.package.links.repository,
    description: result.package.description,
  }));
};
