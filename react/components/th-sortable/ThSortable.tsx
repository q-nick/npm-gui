import * as React from 'react';
import * as style from './th-sortable.css';

interface Props {
  sortMatch: string;
  sortKey: string;
  sortReversed?: boolean;
}

export class ThSortable extends
  React.Component<Props & React.HTMLProps<HTMLTableHeaderCellElement>> {
  render(): React.ReactNode {
    return (
      <th
        className={`${this.props.className} ${style.thSortable}`}
      >
    {/* {this.props.icon && <span className={`oi ${style.oi}`} data-glyph={this.props.icon} />} */}
        {this.props.children}
      </th>
    );
  }
}
