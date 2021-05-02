import {
  createContext, useCallback, useEffect, useState,
} from 'react';

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

export function useScheduleContextValue(): Hook {
  const [schedule, setSchedule] = useState<Hook['schedule']>([]);
  const [doing, setDoing] = useState<Task>();

  const addToApiSchedule = useCallback<Hook['addToApiSchedule']>((task) => {
    if (task.instantSchedule === true) {
      setSchedule((prevSchedule) => [{ ...task, status: 'WAITING', id: new Date().getTime() }, ...prevSchedule]);
    } else {
      setSchedule((prevSchedule) => [...prevSchedule, { ...task, status: 'WAITING', id: new Date().getTime() }]);
    }
  }, []);

  const removeTask = useCallback<Hook['removeTask']>((taskToRemove) => {
    if (taskToRemove.status !== 'RUNNING') {
      setSchedule((prevSchedule) => prevSchedule
        .filter((task) => task.executeMe !== taskToRemove.executeMe));
    }
  }, []);

  async function checkSchedule(): Promise<void> {
    if (!doing) {
      const toDo = schedule.find((task) => task.status === 'WAITING');
      if (toDo) {
        setSchedule((prevSchedule) => prevSchedule.map((task) => {
          if (task.executeMe !== toDo.executeMe) {
            return task;
          }
          return {
            ...task,
            status: 'RUNNING',
          };
        }));
        setDoing(toDo);
        try {
          const startTime = new Date();
          await toDo.executeMe();
          const executionTime = (new Date().getTime() - startTime.getTime()) / THOUSAND;
          setSchedule((prevSchedule) => prevSchedule.map((task) => {
            if (task.executeMe !== toDo.executeMe) {
              return task;
            }
            return {
              ...task,
              description: `${task.description} (took: ${executionTime} s)`,
              status: 'SUCCESS',
            };
          }));

          setTimeout(() => {
            setSchedule((prevSchedule) => prevSchedule
              .filter((task) => task.executeMe !== toDo.executeMe));
          }, FIVE_SEC);
        } catch (e: unknown) {
          const errToDisplay = (e as any).response?.data as string; // eslint-disable-line
          // TODO errors?
          console.error(errToDisplay);
          setSchedule((prevSchedule) => prevSchedule.map((task) => {
            if (task.executeMe !== toDo.executeMe) {
              return task;
            }
            return {
              ...task,
              status: 'ERROR',
              stdout: errToDisplay,
            };
          }));
        }
        setDoing(undefined);
      }
    }
  }

  useEffect(() => {
    void checkSchedule();
  });

  return {
    schedule,
    addToApiSchedule,
    removeTask,
  };
}

export const ScheduleContext = createContext<Hook>({
  schedule: [],
  addToApiSchedule() {},
  removeTask() {},
});
