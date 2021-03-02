import { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import { Button } from '../../../ui/Button/Button';
import {
  ExplorerList, ExplorerButton, ExplorerFile, Wrapper,
} from './ExplorerUI';
import { useClickOutsideRef } from '../../../hooks/useClickOutside';
import type { API, FileOrFolder } from '../../../../server/actions/explorer/explorer';

interface Props {
  onSelectPath: (path: string) => void;
}

export function Explorer({ onSelectPath }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState<FileOrFolder[] | undefined>();
  const [currentPath, setCurrentPath] = useState<string>('');

  const onToggleIsOpen = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
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
    const { data } = await Axios
      .get<API['Response']>(`/api/explorer/${encodedPath || ''}`);

    setList(data.ls);
    setCurrentPath(data.path);
  }, []);

  useEffect(() => {
    void loadPath('');
  }, [loadPath]);

  return (
    <Wrapper ref={ref}>
      <Button icon="folder" onClick={onToggleIsOpen} variant="dark">Open</Button>

      <ExplorerList isOpen={isOpen}>
        <li>
          <ExplorerButton
            isDirectory
            onClick={(): void => { void loadPath(window.btoa(`${currentPath}/../`)); }}
          >
            ../
          </ExplorerButton>
        </li>

        {list?.map((folderOrFile) => (
          <li key={folderOrFile.name}>
            {folderOrFile.isDirectory && !folderOrFile.isProject && (
              <ExplorerButton
                isDirectory
                onClick={(): void => { void loadPath(window.btoa(`${currentPath}/${folderOrFile.name}`)); }}
              >
                <span className="oi" data-glyph="folder" />

                {folderOrFile.name}
                /
              </ExplorerButton>
            )}

            {folderOrFile.isProject && (
              <ExplorerButton
                isDirectory={false}
                isProject
                onClick={onClickProject}
              >
                <span className="oi" data-glyph="arrow-thick-right" />

                {folderOrFile.name}
              </ExplorerButton>
            )}

            {!folderOrFile.isDirectory && !folderOrFile.isProject && (
              <ExplorerFile>
                <span className="oi" data-glyph="file" />

                {folderOrFile.name}
              </ExplorerFile>
            )}
          </li>
        ))}
      </ExplorerList>
    </Wrapper>
  );
}
