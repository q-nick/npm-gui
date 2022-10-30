import { useCallback, useState } from 'react';

interface Hook {
  isOpen: boolean;
  onToggleIsOpen: () => void;
  onClose: () => void;
}

export const useToggle = (): Hook => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggleIsOpen = useCallback(() => {
    setIsOpen((previousIsOpen) => !previousIsOpen);
  }, []);
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, onToggleIsOpen, onClose };
};
