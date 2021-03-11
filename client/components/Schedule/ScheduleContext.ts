import type { AxiosError } from 'axios';
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
          await toDo.executeMe();
          setSchedule((prevSchedule) => prevSchedule
            .filter((task) => task.executeMe !== toDo.executeMe));
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
