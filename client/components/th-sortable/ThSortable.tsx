import * as React from 'react';
import * as style from './th-sortable.css';

export interface Filter {
  type: 'text' | 'select' | null;
  value: any;
  options: any[];
}

export interface Props {
  sortMatch: string;
  sortKey: string;
  sortReversed?: boolean;
  filter?: Filter;
  onSortChange: (sortKey: string) => void;
  onFilterChange: (filterName: string, filterValue: any) => void;
}

function preventEvent(event: React.MouseEvent<HTMLInputElement | HTMLSelectElement>): void {
  event.stopPropagation();
  event.preventDefault();
}

export class ThSortable extends
  React.Component<Props & React.HTMLProps<HTMLTableHeaderCellElement>> {
  onSortChange = (): void => {
    this.props.onSortChange(this.props.sortMatch);
  }

  onFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    this.props.onFilterChange(this.props.sortMatch, event.target.value);
  }

  isTextFilter = (): boolean => {
    return this.props.filter && this.props.filter.type === 'text';
  }

  isSelectFilter = (): boolean => {
    return this.props.filter && this.props.filter.type === 'select';
  }

  renderTextFilter(): React.ReactNode {
    return (
      <input
        className={style.input}
        value={this.props.filter.value}
        type="text"
        onClick={preventEvent}
        onChange={this.onFilterChange}
      />
    );
  }

  renderSelectFilter(): React.ReactNode {
    return (
      <select
        className={style.select}
        value={this.props.filter.value}
        onClick={preventEvent}
        onChange={this.onFilterChange}
      >
        <option value="">any</option>
        <option value="dev">dev</option>
        <option value="prod">prod</option>
      </select>
    );
  }

  render(): React.ReactNode {
    return (
      <th
        className={`${this.props.className} ${style.thSortable}`}
        onClick={this.onSortChange}
      >
        {
          this.props.sortKey === this.props.sortMatch &&
          <span
            className={`oi ${style.thSortableIcon}`}
            data-glyph={this.props.sortReversed ? 'caret-bottom' : 'caret-top'}
          />
        }
        {this.props.children}&nbsp;
        {this.isTextFilter() && this.renderTextFilter()}
        {this.isSelectFilter() && this.renderSelectFilter()}
      </th>
    );
  }
}
