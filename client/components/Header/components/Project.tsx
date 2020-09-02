import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import { Button } from '../../../ui/Button/Button';

const Wrapper = styled.div`
  position: relative;
`;

interface ExplorerProps {
  isOpen: boolean;
}

const Explorer = styled.ul`
  position: absolute;
  background: #3e3f3a;
  right: 0;
  top: 100%;
  z-index: 1;
  max-height: 0;
  max-width: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
  transition: max-width 300ms, max-height 300ms;
  width: 200px;

  ${({ isOpen }: ExplorerProps) => isOpen && css`
    border-color: #dfd7ca;
    max-height: 80vh;
    max-width: 100%;
    overflow-y: scroll;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  `}
`;

const Description = styled.p`
  color: #dfd7ca;
  display: inline-block;
  font-size: 0.9em;
  font-weight: 400;
  margin: 0;
`;

interface ExplorerButtonProps {
  isDirectory: boolean;
  isProject?: boolean;
}

const ExplorerButton = styled.button<ExplorerButtonProps>`
  color: #fff;
  background: none;
  font-size: 12px;
  font-weight: 500;
  border: 0;
  display: inline-block;
  width: 100%;
  text-align: left;
  padding: 0 8px;

  &:hover {
    text-decoration: underline;
    background: #8e8c84;
  }

  ${({ isDirectory }: ExplorerButtonProps) => isDirectory && css`
    max-height: 80vh;
    max-width: 100%;
    overflow-y: scroll;
  `}

  ${({ isProject }: ExplorerButtonProps) => isProject && css`
    color: #d9534f;

    :hover {
      color: #000;
    }
  `}
`;

const ExplorerFile = styled.span`
  color: #8e8c84;
  font-size: 12px;
  font-weight: 500;
  padding: 0 8px;
`;

interface Props {
  projectPathEncoded: string;
  onSelectPath: (path: string) => void;
}

export function Project({ projectPathEncoded, onSelectPath }:Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<any>();
  const [list, setList] = useState<Explorer.FileOrFolder[] | undefined>();
  const [currentPath, setCurrentPath] = useState<string>('');

  const onToggleIsOpen = useCallback(() => setIsOpen((prevIsOpen) => !prevIsOpen), []);

  const onClickProject = useCallback((): void => {
    setIsOpen(false);
    onSelectPath(currentPath);
  }, [currentPath, onSelectPath]);

  const loadPath = useCallback((encodedPath: string): void => {
    // setIsLoading(true);

    axios
      .get<NpmGuiResponse.Explorer>(`/api/explorer/${encodedPath || ''}`)
      .then(({ data }) => {
        // setIsLoading(false);
        // setError(false);
        setList(data.ls);
        setCurrentPath(data.path);

        if (data.changed) {
          onSelectPath(data.path);
        }
      });
    // .catch((err) => {
    //   setIsLoading(false);
    //   setError(err);
    // });
  }, [onSelectPath]);

  useEffect(() => {
    loadPath('');
  }, [loadPath]);

  return (
    <Wrapper>
      <Description>
        Current Project path:
        {' '}
        {projectPathEncoded && window.atob(projectPathEncoded)}
      </Description>
      <Button variant="dark" icon="folder" onClick={onToggleIsOpen} />
      <Explorer isOpen={isOpen}>
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
      </Explorer>
    </Wrapper>
  );
}
