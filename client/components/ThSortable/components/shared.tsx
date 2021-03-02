export interface FilterProps<T extends string> {
  value: T;
  onFilterChange: (newValue: T) => void;
}

export function preventEvent(event: React.MouseEvent<HTMLInputElement | HTMLSelectElement>): void {
  event.stopPropagation();
  event.preventDefault();
}
