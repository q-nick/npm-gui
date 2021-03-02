import React from 'react';
import { Button } from '../../../../../ui/Button/Button';
import type { useSearch } from '../hooks/useSearch';

type Hook = ReturnType<typeof useSearch>;

export interface Props {
  onInstall: (name: string, version: string, type: 'dev' | 'prod') => void;
  searchResults: Hook['searchResults'];
}

const types: ('dev' | 'prod')[] = ['prod', 'dev'];

export function SearchResults({
  searchResults, onInstall,
}: Props): JSX.Element {
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

        {
            searchResults?.map((result) => (
              <tr key={result.name}>
                <td>
                  {(result.score * 100).toFixed(2)}
                  %
                </td>

                <td>
                  <strong>{result.name}</strong>
                </td>

                <td>{result.version}</td>

                <td>
                  <a href={result.url} rel="noreferrer" target="_blank">show repo</a>
                </td>

                <td>
                  {
                    types.map((type) => (
                      <Button
                        key={`${result.name}${type}`}
                        onClick={(): void => {
                          onInstall(
                            result.name,
                            result.version,
                            type,
                          );
                        }}
                        scale="small"
                        variant="info"
                      >
                        {type}
                      </Button>
                    ))
                  }
                </td>
              </tr>
            ))
}
      </tbody>
    </table>

  );
}
