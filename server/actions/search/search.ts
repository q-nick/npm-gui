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
      date: string;
      links: {
        npm: string;
        homepage: string;
        repository: string;
        bugs: string;
      };
    };
    score: {
      final: number;
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
    throw new Error('Unable to get package info');
  }

  return parsed.results.map((result) => ({
    name: result.package.name,
    version: result.package.version,
    score: result.score.final,
    updated: result.package.date,
    npm: result.package.links.npm,
    repository: result.package.links.repository,
    homepage: result.package.links.homepage,
    description: result.package.description,
  }));
};
