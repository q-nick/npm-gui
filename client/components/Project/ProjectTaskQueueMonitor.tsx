import type { FC } from 'react';
import { useContext } from 'react';

import { TaskQueueContext } from '../TaskQueue/TaskQueueContext';
import { ProjectTaskQueueWorker } from './ProjectTaskQueueWorker';

export const ProjectTaskQueueMonitor: FC = ({ children }) => {
  const {
    state: { queue },
  } = useContext(TaskQueueContext);

  return (
    <>
      {Object.keys(queue).map((queueId) => (
        <ProjectTaskQueueWorker key={queueId} projectPath={queueId} />
      ))}
      {children}
    </>
  );
};
