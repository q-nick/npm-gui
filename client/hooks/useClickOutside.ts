import type { RefObject } from 'react';
import { useRef, useEffect } from 'react';

export function useClickOutsideRef(onClickOutside: () => void): RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      function onHandleClick(event: MouseEvent): void {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          onClickOutside();
        }
      }

      window.addEventListener('click', onHandleClick);

      return (): void => {
        window.removeEventListener('click', onHandleClick);
      };
    },
    [ref, onClickOutside],
  );

  return ref;
}
