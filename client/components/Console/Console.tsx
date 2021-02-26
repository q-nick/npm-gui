// import React, { useState, useCallback } from 'react';
// import styled from 'styled-components';
// import { Icon } from '../../ui/Icon/Icon';
// import { Session } from './components/Session';

// interface Props {
//   sessions: NpmGui.ConsoleSession[];
//   onRemoveSession: (id: string) => void;
//   onStopSession: (id: string) => void;
// }

// const Wrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex: 1;
//   position: relative;
// `;

// const Header = styled.header`
//   min-height: 26px;
// `;

// const Title = styled.p`
//   display: inline-block;
//   margin: 0;
// `;

// export function Console({ sessions, onRemoveSession, onStopSession }:Props):JSX.Element {
//   const [
//     fullScreenSessionId,
//     setFullScreenSessionId,
//   ] = useState<string | undefined>(undefined);

//   const onEnterFullScreenSession = useCallback((id: string): void => {
//     setFullScreenSessionId(id);
//   }, []);

//   const onQuitFullScreenSession = useCallback((): void => {
//     setFullScreenSessionId(undefined);
//   }, []);

//   return (
//     <Wrapper>
//       <Header>
//         <Title>
//           <Icon glyph="terminal" />
//           {' '}
//           Console
//         </Title>
//       </Header>
//       {
//           sessions.map((session) => (
//             <Session
//               key={session.id}
//               session={session}
//               onEnterFullScreenSession={onEnterFullScreenSession}
//               onQuitFullScreenSession={onQuitFullScreenSession}
//               onRemoveSession={onRemoveSession}
//               onStopSession={onStopSession}
//               isFullscreen={fullScreenSessionId === session.id}
//             />
//           ))
//         }
//     </Wrapper>
//   );
// }
export const x = 1;
