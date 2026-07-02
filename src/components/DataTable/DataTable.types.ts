import type { ReactNode } from "react";

export type TableCellAlign = "left" | "center" | "right";

export interface DataTableColumn<T extends object> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: TableCellAlign;
  renderCell?: (row: T) => ReactNode;
}

export interface DataTableProps<T extends object> {
  data: T[];
  columns: DataTableColumn<T>[];
  totalCount: number;
  filteredCount: number;
  emptyMessage?: string;
}
export interface DataTableProps<T extends object> {
  title?: string;
  data: T[];
  columns: DataTableColumn<T>[];
  totalCount: number;
  filteredCount: number;
  emptyMessage?: string;
}