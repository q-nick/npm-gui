export interface FilterProps<T extends string> {
  selectedValue: T;
  onFilterChange: (newValue: T) => void;
}

export const preventEvent = (
  event: React.MouseEvent<HTMLInputElement | HTMLSelectElement>,
): void => {
  event.stopPropagation();
  event.preventDefault();
};
