/* eslint-disable unicorn/no-array-reduce */
import { useEffect, useMemo, useState } from 'react';

import type { DependencyInstalledExtras } from '../../../../../../../server/types/dependency.types';

export const parseSemVersion = (
  version: string,
): { major?: string; minor?: string; patch?: string; alfa?: string } => {
  const match = version.match(
    /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(-(?<alfa>.+)){0,1}/,
  );

  return {
    major: match?.groups?.['major'],
    minor: match?.groups?.['minor'],
    patch: match?.groups?.['patch'],
    alfa: match?.groups?.['alfa'],
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useFindOtherVersion = (dependency: DependencyInstalledExtras) => {
  const [selectedMajor, setMajor] = useState<string>();
  const [selectedMinor, setMinor] = useState<string>();
  const reversedVersions = useMemo(
    () => [...(dependency.versions || [])].reverse(),
    [dependency.versions],
  );

  // build major versions
  const versionsMajor = useMemo(
    () =>
      reversedVersions.reduce<string[]>((accumulator, version) => {
        const { major } = parseSemVersion(version);

        if (major && !accumulator.includes(major)) {
          return [...accumulator, major];
        }

        return accumulator;
      }, []),
    [reversedVersions],
  );

  // build minor versions
  const versionsMinor = useMemo(
    () =>
      reversedVersions.reduce<string[]>((accumulator, version) => {
        const { major, minor } = parseSemVersion(version);
        const versionString = `${major}.${minor}`;

        if (
          major === selectedMajor &&
          minor &&
          !accumulator.includes(versionString)
        ) {
          return [...accumulator, versionString];
        }

        return accumulator;
      }, []),
    [reversedVersions, selectedMajor],
  );

  // build patch versions
  const versionsPatch = useMemo(
    () =>
      reversedVersions.reduce<string[]>((accumulator, version) => {
        const { major, minor, patch } = parseSemVersion(version);
        const versionString = `${major}.${minor}.${patch}`;
        // console.log(versionString, version);
        if (
          `${major}.${minor}` === selectedMinor &&
          patch &&
          !accumulator.includes(versionString)
        ) {
          return [...accumulator, version];
        }

        return accumulator;
      }, []),
    [reversedVersions, selectedMinor],
  );

  useEffect(() => {
    if (selectedMajor && !selectedMinor && reversedVersions.length > 0) {
      const majorFirstVersion = reversedVersions.find((version) => {
        const { major } = parseSemVersion(version);

        return selectedMajor === major;
      });

      if (majorFirstVersion) {
        const { major, minor } = parseSemVersion(majorFirstVersion);

        setMinor(`${major}.${minor}`);
      }
    }
  }, [reversedVersions, selectedMajor, selectedMinor]);

  useEffect(() => {
    const [firstVersion] = reversedVersions;

    if (!selectedMajor && firstVersion) {
      const { major } = parseSemVersion(firstVersion);

      setMajor(major);
    }
  }, [reversedVersions, selectedMajor]);

  return {
    versionsMajor,
    versionsMinor,
    versionsPatch,
    setMajor,
    setMinor,
    selectedMajor,
    selectedMinor,
  };
};
