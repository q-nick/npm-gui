import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { Button } from '../../../ui/Button/Button';

interface Props {
  dependency: DependencyInstalledExtras;
}

const Details = styled.div`
  position: absolute;
  background: white;
  border: 1px solid black;
  min-width: 100px;
  z-index: 100;
  text-align: left;
  left: 100%;
  top: -150px;
  height: 300px;
  width: 150px;
  padding: 20px;
  overflow: auto;
`;

export const Required: FC<Props> = ({ children, dependency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minor, setMinor] = useState<string>();

  const versionsMajor = dependency.versions?.reduce<string[]>(
    (accumulator, version) => {
      const match = version.match(
        /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(-(?<alfa>.+)){0,1}/,
      );

      if (
        match?.groups?.['major'] &&
        !accumulator.includes(match.groups['major'])
      ) {
        return [match?.groups?.['major'], ...accumulator];
      }

      return accumulator;
    },
    [],
  );

  return (
    <div
      onMouseEnter={(): void => setIsOpen(true)}
      onMouseLeave={(): void => setIsOpen(false)}
      style={{ position: 'relative' }}
    >
      {children}
      {isOpen && (
        <Details>
          {versionsMajor?.map((version) => (
            <div key={version} onMouseEnter={(): void => setMinor(version)}>
              <Button
                icon="cloud-download"
                title={`Install ${version}`}
                variant="success"
              >
                {version}
              </Button>
              =&gt;
              <br />
              <br />
            </div>
          ))}
        </Details>
      )}
    </div>
  );
};
