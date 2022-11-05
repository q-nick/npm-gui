import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

export const useClickOutsideRef = (
  onClickOutside: () => void,
): RefObject<HTMLDivElement> => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onHandleClick = ({ target }: MouseEvent): void => {
      if (ref.current && target && !ref.current.contains(target as Node)) {
        onClickOutside();
      }
    };

    window.addEventListener('click', onHandleClick, true);

    return (): void => {
      window.removeEventListener('click', onHandleClick, true);
    };
  }, [ref, onClickOutside]);

  return ref;
};
