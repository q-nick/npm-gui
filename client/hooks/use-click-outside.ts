import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

export const useClickOutsideRef = (
  onClickOutside: () => void,
): RefObject<HTMLDivElement> => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onHandleClick = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    window.addEventListener('click', onHandleClick);

    return (): void => {
      window.removeEventListener('click', onHandleClick);
    };
  }, [ref, onClickOutside]);

  return ref;
};
