import type { ReactNode } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { Button } from '../../../ui/Button/Button';

const Wrapper = styled.div`
  border-left: 1px solid #dfd7ca;
  background: #f8f5f0;
  height: 24px;
`;

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

export const RequiredCell = ({
  versions,
  required,
  name,
}: DependencyInstalledExtras): ReactNode => {
  // no hooks here
  // const [isOpen, setIsOpen] = useState(false);
  // const [minor, setMinor] = useState<string>();

  const versionsMajor = versions?.reduce<string[]>((accumulator, version) => {
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
  }, []);

  return (
    <Wrapper
      // onMouseEnter={(): void => setIsOpen(true)}
      // onMouseLeave={(): void => setIsOpen(false)}
      style={{ position: 'relative' }}
    >
      {required}
      {false && (
        <Details>
          {versionsMajor?.map((version) => (
            <div
              key={name + version}
              // onMouseEnter={(): void => setMinor(version)}
            >
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
    </Wrapper>
  );
};
