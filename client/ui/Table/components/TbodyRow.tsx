import type { ReactNode } from 'react';

export interface TableRowAbstract {
  [key: string]: unknown;
  name: string;
  hideBottomBorder?: true;
  drawFolder?: true;
}

export interface IColumn<T extends TableRowAbstract> {
  name: string;
  label?: ReactNode;
  sortable?: true;
  filterable?: string[] | true;
  render?: (row: T, abs: unknown) => ReactNode;
}

interface Props<T extends TableRowAbstract> {
  row: T;
  columns: IColumn<any>[];
}

export const TbodyRow = <T extends TableRowAbstract>({
  row,
  columns,
}: // eslint-disable-next-line @typescript-eslint/ban-types
Props<T>): JSX.Element => {
  return (
    <tr key={`row-${row.name}`}>
      {columns.map((column) => {
        return (
          <td
            key={`row-${row.name}-column-${column.name}`}
            style={row.hideBottomBorder ? { borderBottom: 0 } : {}}
          >
            {column.render
              ? column.render(row, row[column.name])
              : row[column.name]}
          </td>
        );
      })}
    </tr>
  );
};
