import request from 'request';
import type { ResponserFunction } from '../../newServerTypes';

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

async function requestWithPromise<T>(url: string): Promise<T> {
  return new Promise((resolve) => {
    request(url, (_: unknown, __: unknown, body) => {
      resolve(JSON.parse(body));
    });
  });
}

async function searchNPM(query: string): Promise<Result[]> {
  const { results } = await requestWithPromise<NPMApiResult>(`https://api.npms.io/v2/search?from=0&size=25&q=${query}`);
  return results.map((result) => ({
    name: result.package.name,
    version: result.package.version,
    score: result.score.final,
    url: result.package.links.repository,
    description: result.package.description,
  }));
}

export const search: ResponserFunction<{ query: string }> = async ({ body: { query } }) => {
  const results = await searchNPM(query);
  return results;
};
