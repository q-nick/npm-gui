import * as React from 'react';
import * as style from './th-sortable.css';

export interface Props {
  sortMatch: string;
  sortKey: string;
  sortReversed?: boolean;
  filter?: 'text' | 'select' | null;
  onSortChange: (sortKey: string) => void;
}

export class ThSortable extends
  React.Component<Props & React.HTMLProps<HTMLTableHeaderCellElement>> {
  onSortChange = (): void => {
    this.props.onSortChange(this.props.sortMatch);
  }

  isTextFilter = (): boolean => {
    return this.props.filter && this.props.filter === 'text';
  }

  isSelectFilter = (): boolean => {
    return this.props.filter && this.props.filter === 'select';
  }

  renderTextFilter(): React.ReactNode {
    return <input className={style.input} type="text"/>;
  }

  renderSelectFilter(): React.ReactNode {
    return <select className={style.input} />;
  }

  render(): React.ReactNode {
    return (
      <th
        className={`${this.props.className} ${style.thSortable}`}
        onClick={this.onSortChange}
      >
        {this.props.children}&nbsp;
        {
          this.props.sortKey === this.props.sortMatch &&
            <span
              className={'oi'}
              data-glyph={this.props.sortReversed ? 'caret-bottom' : 'caret-top'}
            />
        }
        {this.isTextFilter() && this.renderTextFilter()}
        {this.isSelectFilter() && this.renderSelectFilter()}
      </th>
    );
  }
}
