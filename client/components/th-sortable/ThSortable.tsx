import * as React from 'react';
import * as style from './th-sortable.css';

interface Props {
  sortMatch: string;
  sortKey: string;
  sortReversed?: boolean;
  onSortChange: (sortKey: string) => void;
}

export class ThSortable extends
  React.Component<Props & React.HTMLProps<HTMLTableHeaderCellElement>> {
  onSortChange = (): void => {
    this.props.onSortChange(this.props.sortMatch);
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
      </th>
    );
  }
}
