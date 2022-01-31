import { createContext, useCallback, useEffect, useState } from 'react';

export interface Task {
  id: number;
  projectPath: string;
  description: string;
  executeMe: () => Promise<unknown>;
  status: 'ERROR' | 'RUNNING' | 'SUCCESS' | 'WAITING';
  stdout?: string;
  instantSchedule?: boolean;
}

interface Hook {
  schedule: Task[];
  addToApiSchedule: (task: Omit<Task, 'id' | 'status'>) => void;
  removeTask: (task: Task) => void;
}

const THOUSAND = 1000;
const FIVE_SEC = 5000;

export const useScheduleContextValue = (): Hook => {
  const [schedule, setSchedule] = useState<Hook['schedule']>([]);
  const [doing, setDoing] = useState<Task | undefined>();

  const addToApiSchedule = useCallback<Hook['addToApiSchedule']>((task) => {
    if (task.instantSchedule === true) {
      setSchedule((previousSchedule) => [
        { ...task, status: 'WAITING', id: Date.now() },
        ...previousSchedule,
      ]);
    } else {
      setSchedule((previousSchedule) => [
        ...previousSchedule,
        { ...task, status: 'WAITING', id: Date.now() },
      ]);
    }
  }, []);

  const removeTask = useCallback<Hook['removeTask']>((taskToRemove) => {
    if (taskToRemove.status !== 'RUNNING') {
      setSchedule((previousSchedule) =>
        previousSchedule.filter(
          (task) => task.executeMe !== taskToRemove.executeMe,
        ),
      );
    }
  }, []);

  const checkSchedule = async (): Promise<void> => {
    if (!doing) {
      const toDo = schedule.find((task) => task.status === 'WAITING');
      if (toDo) {
        setSchedule((previousSchedule) =>
          previousSchedule.map((task) => {
            if (task.executeMe !== toDo.executeMe) {
              return task;
            }
            return {
              ...task,
              status: 'RUNNING',
            };
          }),
        );
        setDoing(toDo);
        try {
          const startTime = new Date();
          await toDo.executeMe();
          const executionTime = (Date.now() - startTime.getTime()) / THOUSAND;
          setSchedule((previousSchedule) =>
            previousSchedule.map((task) => {
              if (task.executeMe !== toDo.executeMe) {
                return task;
              }
              return {
                ...task,
                description: `${task.description} (took: ${executionTime} s)`,
                status: 'SUCCESS',
              };
            }),
          );

          setTimeout(() => {
            setSchedule((previousSchedule) =>
              previousSchedule.filter(
                (task) => task.executeMe !== toDo.executeMe,
              ),
            );
          }, FIVE_SEC);
        } catch (error: unknown) {
          const errorToDisplay = (error as any).response?.data as string;
          // TODO errors?
          console.error(errorToDisplay);
          setSchedule((previousSchedule) =>
            previousSchedule.map((task) => {
              if (task.executeMe !== toDo.executeMe) {
                return task;
              }
              return {
                ...task,
                status: 'ERROR',
                stdout: errorToDisplay,
              };
            }),
          );
        }
        setDoing(undefined);
      }
    }
  };

  useEffect(() => {
    void checkSchedule();
  });

  return {
    schedule,
    addToApiSchedule,
    removeTask,
  };
};

export const ScheduleContext = createContext<Hook>({
  schedule: [],
  addToApiSchedule() {},
  removeTask() {},
});
