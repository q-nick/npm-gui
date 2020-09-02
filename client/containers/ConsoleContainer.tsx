import React, { useState, useCallback, useEffect } from 'react';
import { Console } from '../components/Console/Console';

export function ConsoleContainer(): JSX.Element {
  const [sessions, setSessions] = useState<NpmGui.ConsoleSession[]>([]);

  const addMessageToSession = useCallback(
    (message: NpmGui.ConsoleSession): void => {
      setSessions((prevSessions): typeof sessions => {
        const sessionExists = prevSessions.some((session) => session.id === message.id);

        if (!sessionExists) {
          return [
            ...prevSessions,
            message,
          ];
        }

        return prevSessions.map((session) => {
          if (session.id === message.id) {
            return {
              id: session.id,
              status: message.status,
              msg: session.msg + message.msg,
            };
          }

          return session;
        });
      });
    },
    [],
  );

  const onRemoveSession = useCallback((id:string) => {
    setSessions((prevSessions) => {
      if (!prevSessions) {
        return prevSessions;
      }

      return prevSessions.filter((session) => session.id !== id);
    });
  }, []);

  const onStopSession = useCallback((id:string) => {
    console.log(id);
  }, []);

  useEffect(() => {
    const consoleSocket = new WebSocket(`ws://${window.location.host}/api/console`);
    consoleSocket.onmessage = (msg) => addMessageToSession(JSON.parse(msg.data));
  }, [addMessageToSession]);
  console.log(sessions);
  if (!sessions) {
    return <></>;
  }

  return (
    <Console
      sessions={sessions}
      onRemoveSession={onRemoveSession}
      onStopSession={onStopSession}
    />
  );
}
