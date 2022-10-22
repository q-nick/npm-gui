/* eslint-disable max-lines */
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import type { VFC } from 'react';
import styled, { css } from 'styled-components';

import type {
  Basic,
  DependencyInstalledExtras,
  Type,
} from '../../../../server/types/dependency.types';
import type { CSSType } from '../../../Styled';
import { ConfirmButton } from '../../../ui/Button/ConfirmButton';
import { Link } from '../../../ui/Button/Link';
import { ScoreBadge } from '../../../ui/ScoreBadge/ScoreBadge';
import { useProjectPath } from '../../use-project-path';
import { Required } from './Required';
import { normalizeRepositoryLink, timeSince } from './utils';
import { Missing, Version } from './Version';

interface Props {
  dependency: DependencyInstalledExtras;
  isProcessing: boolean;
  hasTypesBelow: boolean;
  isTypesBelow: boolean;
  isGlobal: boolean;
  onDeleteDependency: (dependency: DependencyInstalledExtras) => void;
  onInstallDependencyVersion: (dependency: Basic, type: Type) => void;
}

interface TrStyledProps {
  isProcessing: boolean;
  hasTypesBelow: boolean;
}

const ONE_KB = 1024;
const DIGITS = 2;

const TrStyled = styled.tr<TrStyledProps>`
  @keyframes Gradient {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  ${({ isProcessing }): CSSType =>
    isProcessing &&
    css`
      background: linear-gradient(-45deg, #dfd7ca, #fff);
      background-size: 200% 200%;
      animation: Gradient 2s ease infinite;
    `}

  ${({ hasTypesBelow }): CSSType =>
    hasTypesBelow &&
    css`
      td {
        border-bottom: 0px;
      }
    `}
`;

const Cell = styled.td`
  width: 10%;
  min-width: 80px;
`;

const CellAction = styled.td`
  width: 30px;
`;

export const DependencyRow: VFC<Props> = ({
  dependency,
  hasTypesBelow,
  isTypesBelow,
  onDeleteDependency,
  onInstallDependencyVersion,
  isGlobal,
}) => {
  const projectPath = useProjectPath();

  const isFetching =
    useIsFetching([projectPath, 'get-project-dependencies']) > 0;

  const isMutating = useIsMutating([projectPath]) > 0;

  const isProcessing = isFetching || isMutating;

  return (
    <TrStyled
      hasTypesBelow={hasTypesBelow}
      isProcessing={isProcessing}
      key={`${dependency.name}${dependency.manager}`}
    >
      {!isGlobal && <td>{dependency.type !== 'prod' && dependency.type}</td>}

      <CellName prod={dependency.type === 'prod'}>
        <Name>
          <span>
            {isTypesBelow && <>&nbsp;└─ </>}
            {dependency.name}
          </span>
          <span>
            {dependency.homepage &&
              normalizeRepositoryLink(dependency.homepage) !==
                normalizeRepositoryLink(dependency.repository) && (
                <Link
                  href={dependency.homepage}
                  icon="home"
                  target="_blank"
                  title="Go to package home page"
                />
              )}
            {dependency.repository && (
              <>
                &nbsp;
                <Link
                  href={normalizeRepositoryLink(dependency.repository)}
                  icon="fork"
                  target="_blank"
                  title="Go to code repository"
                />
              </>
            )}
            &nbsp;
            <Link
              href={`https://www.npmjs.com/package/${dependency.name}`}
              target="_blank"
              title="Open NPM site with package details"
              variant="danger"
            >
              {dependency.manager}
            </Link>
          </span>
        </Name>
      </CellName>

      <Cell>
        {typeof dependency.score === 'number' && (
          <ScoreBadge
            href={`https://snyk.io/advisor/npm-package/${dependency.name}`}
            score={dependency.score}
            target="_blank"
          >
            {dependency.score}%
          </ScoreBadge>
        )}
      </Cell>

      <Cell>
        {typeof dependency.size === 'number' && (
          <Link
            href={`https://bundlephobia.com/package/${dependency.name}@${dependency.installed}`}
            target="_blank"
            title="Visit bundlephobia package details"
          >
            {`${Number.parseFloat(`${dependency.size / ONE_KB}`).toFixed(
              DIGITS,
            )}kB`}
          </Link>
        )}
      </Cell>

      <Cell>
        {dependency.updated &&
          timeSince(new Date(dependency.updated).getTime())}
      </Cell>

      {!isGlobal && (
        <Cell>
          <Required dependency={dependency}>{dependency.required}</Required>

          {typeof dependency.required !== 'string' && (
            <Missing>extraneous</Missing>
          )}
        </Cell>
      )}

      <Cell>
        <Version
          dependency={dependency}
          isInstalled
          isProcessing={isProcessing}
          onInstall={(version): void => {
            onInstallDependencyVersion(
              { name: dependency.name, version },
              dependency.type,
            );
          }}
          version={dependency.installed}
        />
      </Cell>

      <Cell>
        <Version
          dependency={dependency}
          isProcessing={isProcessing}
          onInstall={(version): void => {
            onInstallDependencyVersion(
              { name: dependency.name, version },
              dependency.type,
            );
          }}
          version={dependency.wanted}
        />
      </Cell>

      <Cell>
        <Version
          dependency={dependency}
          isProcessing={isProcessing}
          onInstall={(version): void => {
            onInstallDependencyVersion(
              { name: dependency.name, version },
              dependency.type,
            );
          }}
          version={dependency.latest}
        />
      </Cell>

      <CellAction>
        <ConfirmButton
          disabled={isProcessing}
          icon="trash"
          onClick={(): void => {
            onDeleteDependency(dependency);
          }}
          title="Remove package from project"
          variant="danger"
        />
      </CellAction>
    </TrStyled>
  );
};
