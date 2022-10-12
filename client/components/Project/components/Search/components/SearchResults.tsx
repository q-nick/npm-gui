import type { VFC } from 'react';

import { Button } from '../../../../../ui/Button/Button';
import type { useSearch } from '../hooks/use-search';

type Hook = ReturnType<typeof useSearch>;

export interface Props {
  onInstall: (name: string, version: string, type: 'dev' | 'prod') => void;
  searchResults: Hook['searchResults'];
}

const types: ('dev' | 'prod')[] = ['prod', 'dev'];

const DIGITS = 2;
const SCORE = 100;

export const SearchResults: VFC<Props> = ({ searchResults, onInstall }) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>score</th>

          <th>name</th>

          <th>version</th>

          <th>github</th>

          <th>install</th>
        </tr>

        {searchResults?.map((result) => (
          <tr key={result.name}>
            <td>{(result.score * SCORE).toFixed(DIGITS)}%</td>

            <td>
              <strong>{result.name}</strong>
            </td>

            <td>{result.version}</td>

            <td>
              <a href={result.url} rel="noreferrer" target="_blank">
                show repo
              </a>
            </td>

            <td>
              {types.map((type) => (
                <Button
                  key={`${result.name}${type}`}
                  onClick={(): void => {
                    onInstall(result.name, result.version, type);
                  }}
                  title={`Install ${result.name}@${result.version} as ${type}`}
                  variant="info"
                >
                  {type}
                </Button>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
