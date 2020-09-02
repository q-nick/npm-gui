export interface FilterProps {
  value: string;
  onFilterChange: (newValue:string) => void;
}

export function preventEvent(event: React.MouseEvent<HTMLInputElement | HTMLSelectElement>): void {
  event.stopPropagation();
  event.preventDefault();
}
