import React, { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import { Button } from '../../../ui/Button/Button';
import {
 ExplorerList, ExplorerButton, ExplorerFile, Wrapper,
} from './ExplorerUI';
import { useClickOutsideRef } from '../../../hooks/useClickOutside';

interface Props {
  onSelectPath: (path: string) => void;
}

export function Explorer({ onSelectPath }:Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<any>();
  const [list, setList] = useState<Explorer.FileOrFolder[] | undefined>();
  const [currentPath, setCurrentPath] = useState<string>('');

  const onToggleIsOpen = useCallback(() => setIsOpen((prevIsOpen) => !prevIsOpen), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  const ref = useClickOutsideRef(onClose);

  const onClickProject = useCallback((): void => {
    setIsOpen(false);
    onSelectPath(currentPath);
  }, [currentPath, onSelectPath]);

  const loadPath = useCallback(async (encodedPath: string): Promise<void> => {
    // setIsLoading(true);

    const {data} = await Axios
      .get<NpmGuiResponse.Explorer>(`/api/explorer/${encodedPath || ''}`)

    // setIsLoading(false);
    // setError(false);
    setList(data.ls);
    setCurrentPath(data.path);
    // .catch((err) => {
    //   setIsLoading(false);
    //   setError(err);
    // });
  }, [onSelectPath]);

  useEffect(() => {
    loadPath('');
  }, [loadPath]);

  return (
    <Wrapper ref={ref}>
      <Button variant="dark" icon="folder" onClick={onToggleIsOpen} >Open</Button>
      <ExplorerList isOpen={isOpen}>
        <li>
          <ExplorerButton
            isDirectory
            onClick={() => loadPath(window.btoa(`${currentPath}/../`))}
          >
            ../
          </ExplorerButton>
        </li>
        {list && list.map((folderOrFile) => (
          <li key={folderOrFile.name}>
            {folderOrFile.isDirectory && !folderOrFile.isProject && (
            <ExplorerButton
              isDirectory
              onClick={() => loadPath(window.btoa(`${currentPath}/${folderOrFile.name}`))}
            >
              <span className="oi" data-glyph="folder" />
              {' '}
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
                {' '}
                <span className="oi" data-glyph="arrow-thick-right" />
                {' '}
                {folderOrFile.name}
              </ExplorerButton>
            )}

            {!folderOrFile.isDirectory && !folderOrFile.isProject && (
              <ExplorerFile>
                <span className="oi" data-glyph="file" />
                {' '}
                {folderOrFile.name}
              </ExplorerFile>
            )}
          </li>
        ))}
      </ExplorerList>
    </Wrapper>
  );
}
