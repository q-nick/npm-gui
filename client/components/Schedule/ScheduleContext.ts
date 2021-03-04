import type { AxiosError } from 'axios';
import {
  createContext, useCallback, useEffect, useState,
} from 'react';

export interface Task {
  projectPath: string;
  description: string;
  executeMe: () => Promise<unknown>;
  status: 'ERROR' | 'RUNNING' | 'SUCCESS' | 'WAITING';
  stdout?: string;
}

interface Hook {
  schedule: Task[];
  addToApiSchedule: (task: Omit<Task, 'status'>) => void;
  removeTask: (task: Task) => void;
}

export function useScheduleContextValue(): Hook {
  const [schedule, setSchedule] = useState<Hook['schedule']>([]);
  const [doing, setDoing] = useState<Task>();

  const addToApiSchedule = useCallback<Hook['addToApiSchedule']>((task) => {
    setSchedule((prevSchedule) => [...prevSchedule, { ...task, status: 'WAITING' }]);
  }, []);

  const removeTask = useCallback<Hook['removeTask']>((taskToRemove) => {
    if (taskToRemove.status !== 'RUNNING') {
      setSchedule((prevSchedule) => prevSchedule
        .filter((task) => task.executeMe !== taskToRemove.executeMe));
    }
  }, []);

  async function checkSchedule(): Promise<void> {
    console.log('checking', !doing);
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
          await toDo.executeMe();
          setSchedule((prevSchedule) => prevSchedule.map((task) => {
            if (task.executeMe !== toDo.executeMe) {
              return task;
            }
            return {
              ...task,
              status: 'SUCCESS',
            };
          }));
        } catch (e: unknown) {
          const errToDisplay = (e as AxiosError).response?.data as string;
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
