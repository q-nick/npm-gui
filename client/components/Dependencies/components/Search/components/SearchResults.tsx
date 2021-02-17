import React from 'react';
import { Button } from '../../../../../ui/Button/Button';
import { useSearch } from '../hooks/useSearch';

type Hook = ReturnType<typeof useSearch>;

export interface Props {
  onInstall: (name: string, version: string, type:'prod' | 'dev') => void;
  searchResults: Hook['searchResults'];
}

const types: ('prod' | 'dev')[] = ['prod', 'dev'];

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
            searchResults
            && searchResults.map((result) => (
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
                  <a target="_blank" rel="noreferrer" href={result.url}>show repo</a>
                </td>
                <td>
                  {
                    types.map((type) => (
                      <Button
                        key={`${result.name}${type}`}
                        variant="info"
                        scale="small"
                        onClick={() => onInstall(
                          result.name,
                          result.version,
                          type,
                        )}
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
