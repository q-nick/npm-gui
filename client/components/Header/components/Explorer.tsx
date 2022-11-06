import type { VFC } from 'react';

import { Button } from '../../../ui/Button/Button';
import {
  ExplorerButton,
  ExplorerCurrentLocation,
  ExplorerFile,
  ExplorerList,
  ExplorerSearch,
  Wrapper,
} from './ExplorerUi';
import { useExplorer } from './use-explorer';

export const Explorer: VFC = () => {
  const {
    ref,
    onToggleIsOpen,
    isOpen,
    path,
    list,
    isFetching,
    filter,
    setFilter,
    onClickProject,
    setCurrentPath,
  } = useExplorer();

  return (
    <Wrapper ref={ref}>
      <Button
        icon="folder"
        onClick={onToggleIsOpen}
        title="Find project on disk"
        variant="dark"
      >
        Open
      </Button>

      <ExplorerList isOpen={isOpen}>
        <li>
          <ExplorerCurrentLocation>{path}</ExplorerCurrentLocation>
        </li>
        <li>
          <ExplorerSearch
            onChange={(event): void => setFilter(event.target.value)}
            placeholder="Type to filter"
            value={filter}
          />
        </li>
        <li>
          <ExplorerButton
            disabled={isFetching}
            isDirectory
            onClick={(): void => {
              setCurrentPath(window.btoa(`${path}/../`));
            }}
          >
            ../
          </ExplorerButton>
        </li>

        {list
          ?.filter((folderOrFile) => folderOrFile.name.includes(filter))
          .map((folderOrFile) => (
            <li key={folderOrFile.name}>
              {folderOrFile.isDirectory && !folderOrFile.isProject && (
                <ExplorerButton
                  disabled={folderOrFile.name === 'node_modules' || isFetching}
                  isDirectory
                  onClick={(): void => {
                    setCurrentPath(window.btoa(`${path}/${folderOrFile.name}`));
                  }}
                >
                  ├─ &nbsp;
                  <span className="oi" data-glyph="folder" />
                  &nbsp;
                  {folderOrFile.name}/
                </ExplorerButton>
              )}

              {folderOrFile.isProject && (
                <ExplorerButton
                  disabled={isFetching}
                  isDirectory={false}
                  isProject
                  onClick={onClickProject}
                >
                  ├─ &nbsp;
                  <span className="oi" data-glyph="arrow-thick-right" />
                  &nbsp;
                  {folderOrFile.name}
                </ExplorerButton>
              )}

              {!folderOrFile.isDirectory && !folderOrFile.isProject && (
                <ExplorerFile>
                  ├─ &nbsp;
                  <span className="oi" data-glyph="file" />
                  &nbsp;
                  {folderOrFile.name}
                </ExplorerFile>
              )}
            </li>
          ))}
      </ExplorerList>
    </Wrapper>
  );
};
