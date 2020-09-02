import * as React from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../../../ui/Button/Button';

interface Props {
  session: NpmGui.ConsoleSession;
  isFullscreen: boolean;
  onQuitFullScreenSession: () => void;
  onEnterFullScreenSession: (id: string) => void;
  onRemoveSession: (id: string) => void;
  onStopSession: (id: string) => void;
}

interface WrapperProps {
  session: NpmGui.ConsoleSession;
  isFullscreen: boolean;
}

const Menu = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  padding-top: 20px;
  padding-left: 5px;
  padding-right: 5px;
  z-index: 1;
  opacity: 0;
  transition: opacity 500ms ease-in-out;
`;

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex: 1;
  padding-bottom: 0;
  padding-top: 15px;
  position: relative;
  width: 100%;
  transition: flex 1500ms ease-in-out, width 1000ms ease-in-out;
  overflow: hidden;
  z-index: 1;

  &:hover {
    flex: 100;
    z-index: 2;
  }

  &:hover > ${Menu} {
    opacity: 1;
  }

  ${({ isFullscreen }: WrapperProps) => isFullscreen && css`
    width: 200%;
  `}

  ${({ session }: WrapperProps) => session.status === 'CLOSE' && css`
    > pre {
      background-color: #fafff2;
      border-color: #79a736;
    }
  `}

  ${({ session }: WrapperProps) => session.status === 'ERROR' && css`
    > pre {
      background-color: #fff8f8;
      border-color: #d9534f;
    }
  `}
`;

const Pre = styled.pre`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #dfd7ca;
  border-radius: 2px;
  color: #8e8c84;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 0.8em;
  overflow: auto;
  padding: 7px;
  position: relative;
  word-break: break-all;
  word-wrap: break-word;
  flex: 1;
  margin: 0;
  white-space: pre-wrap;
`;

const PreParagraph = styled.p`
  left: 7px;
  position: absolute;
  top: 7px;
  margin: 0;
`;

export function Session({
  session,
  isFullscreen,
  onEnterFullScreenSession,
  onQuitFullScreenSession,
  onRemoveSession,
  onStopSession,
}:Props):JSX.Element {
  return (
    <Wrapper
      key={session.id}
      session={session}
      isFullscreen={isFullscreen}
    >
      <Menu>
        {
          !isFullscreen
          && (
          <Button
            variant="primary"
            scale="small"
            icon="fullscreen-enter"
            onClick={() => onEnterFullScreenSession(session.id)}
          >
            Enlarge
          </Button>
          )
        }
        {
          isFullscreen
          && (
          <Button
            variant="primary"
            scale="small"
            icon="fullscreen-exit"
            onClick={onQuitFullScreenSession}
          >
            Shrink
          </Button>
          )
        }
        {
          session.status === 'LIVE'
          && (
          <Button
            variant="danger"
            scale="small"
            icon="x"
            onClick={() => onStopSession(session.id)}
          >
            Cancel/Stop
          </Button>
          )
        }
        {
          ['CLOSE', 'ERROR'].includes(session.status)
          && (
          <Button
            variant="danger"
            scale="small"
            icon="fullscreen-exit"
            onClick={() => onRemoveSession(session.id)}
          >
            remove
          </Button>
          )
        }
      </Menu>
      <Pre><PreParagraph>{session.msg}</PreParagraph></Pre>
    </Wrapper>
  );
}
