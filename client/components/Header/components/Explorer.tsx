import type { VFC } from 'react';
import { useCallback, useEffect, useState } from 'react';

import type {
  API,
  FileOrFolder,
} from '../../../../server/actions/explorer/explorer';
import { useClickOutsideRef } from '../../../hooks/use-click-outside';
import { Button } from '../../../ui/Button/Button';
import {
  ExplorerButton,
  ExplorerCurrentLocation,
  ExplorerFile,
  ExplorerList,
  ExplorerSearch,
  Wrapper,
} from './ExplorerUi';

interface Props {
  onSelectPath: (path: string) => void;
}

export const Explorer: VFC<Props> = ({ onSelectPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [list, setList] = useState<FileOrFolder[] | undefined>();
  const [currentPath, setCurrentPath] = useState<string>('');

  const onToggleIsOpen = useCallback(() => {
    setIsOpen((previousIsOpen) => !previousIsOpen);
  }, []);
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ref = useClickOutsideRef(onClose);

  const onClickProject = useCallback((): void => {
    setIsOpen(false);
    onSelectPath(currentPath);
  }, [currentPath, onSelectPath]);

  const loadPath = useCallback(async (encodedPath: string): Promise<void> => {
    const response = await fetch(`/api/explorer/${encodedPath || ''}`);
    const data = (await response.json()) as API['Response'];

    setList(data.ls);
    setCurrentPath(data.path);
    setFilter('');
  }, []);

  useEffect(() => {
    void loadPath('');
  }, [loadPath]);

  return (
    <Wrapper ref={ref}>
      <Button icon="folder" onClick={onToggleIsOpen} variant="dark">
        Open
      </Button>

      <ExplorerList isOpen={isOpen}>
        <li>
          <ExplorerCurrentLocation>{currentPath}</ExplorerCurrentLocation>
        </li>
        <li>
          <ExplorerSearch
            onChange={(event): void => setFilter(event.target.value)}
            placeholder="filter results"
            value={filter}
          />
        </li>
        <li>
          <ExplorerButton
            isDirectory
            onClick={(): void => {
              loadPath(window.btoa(`${currentPath}/../`));
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
                  disabled={folderOrFile.name === 'node_modules'}
                  isDirectory
                  onClick={(): void => {
                    loadPath(
                      window.btoa(`${currentPath}/${folderOrFile.name}`),
                    );
                  }}
                >
                  <span className="oi" data-glyph="folder" />
                  &nbsp;
                  {folderOrFile.name}/
                </ExplorerButton>
              )}

              {folderOrFile.isProject && (
                <ExplorerButton
                  isDirectory={false}
                  isProject
                  onClick={onClickProject}
                >
                  <span className="oi" data-glyph="arrow-thick-right" />
                  &nbsp;
                  {folderOrFile.name}
                </ExplorerButton>
              )}

              {!folderOrFile.isDirectory && !folderOrFile.isProject && (
                <ExplorerFile>
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
