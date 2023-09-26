import type { FC } from 'react';
import React from 'react';

import { Button } from '../../ui/Button/Button';
import { Explorer } from './components/Explorer';
import { useHeader } from './use-header';

export interface HeaderButton {
  text: string;
  routeName: string;
  icon: string;
}

export const Header: FC = () => {
  const { projectPathEncoded, projects, handleRemoveProject } = useHeader();

  return (
    <nav className="flex p-2 justify-between bg-neutral-700">
      <div className="flex gap-2">
        <h1 className="text-base text-white font-normal">npm-gui</h1>

        <Button
          icon="globe"
          navigate="/"
          title="Show global packages"
          variant={projectPathEncoded === 'global' ? 'info' : 'dark'}
        >
          Global
        </Button>
      </div>

      <div className="flex gap-2">
        {projects
          .filter(({ path }) => path !== 'global')
          .map(({ path }) => (
            <React.Fragment key={path}>
              <Button
                icon="code"
                navigate={`/${path}`}
                title={window.atob(path)}
                variant={path === projectPathEncoded ? 'info' : 'dark'}
              >
                {window.atob(path).split('/').reverse()[0]}
              </Button>
              <Button
                icon="x"
                onClick={(): void => handleRemoveProject(path)}
                title="Remove"
                variant={path === projectPathEncoded ? 'info' : 'dark'}
              />
            </React.Fragment>
          ))}

        <Explorer />
      </div>
    </nav>
  );
};
