import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { getValueByPath } from "../../lib/filtering/getValueByPath";
import { formatTableCellValue } from "../../lib/utils/formatters";
import type {
  DataTableColumn,
  DataTableProps,
} from "./DataTable.types";

type SortDirection = "asc" | "desc";

interface SortState {
  columnKey: string;
  direction: SortDirection;
}

export function DataTable<T extends object>({
  title = "Records",
  data,
  columns,
  totalCount,
  filteredCount,
  emptyMessage = "No results found.",
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState | null>(null);

  const sortedData = useMemo(() => {
    if (!sortState) {
      return data;
    }

    return [...data].sort((firstRow, secondRow) => {
      const firstValue = getValueByPath(firstRow, sortState.columnKey);
      const secondValue = getValueByPath(secondRow, sortState.columnKey);

      return compareValues(firstValue, secondValue, sortState.direction);
    });
  }, [data, sortState]);

  function handleSort(column: DataTableColumn<T>) {
    if (!column.sortable) {
      return;
    }

    setSortState((previousSort) => {
      if (previousSort?.columnKey === column.key) {
        return {
          columnKey: column.key,
          direction: previousSort.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        columnKey: column.key,
        direction: "asc",
      };
    });
  }

  return (
    <Paper elevation={2}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Showing {filteredCount} of {totalCount} records
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const isActiveSort = sortState?.columnKey === column.key;

                return (
                  <TableCell
                    key={column.key}
                    align={column.align ?? "left"}
                    sortDirection={isActiveSort ? sortState.direction : false}
                    sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={isActiveSort}
                        direction={isActiveSort ? sortState.direction : "asc"}
                        onClick={() => handleSort(column)}
                      >
                        {column.header}
                      </TableSortLabel>
                    ) : (
                      column.header
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, rowIndex) => (
                <TableRow key={getRowKey(row, rowIndex)} hover>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align ?? "left"}
                      sx={{ maxWidth: 260 }}
                    >
                      {column.renderCell
                        ? column.renderCell(row)
                        : formatTableCellValue(getValueByPath(row, column.key))}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function compareValues(
  firstValue: unknown,
  secondValue: unknown,
  direction: SortDirection
): number {
  const directionMultiplier = direction === "asc" ? 1 : -1;

  if (firstValue === secondValue) {
    return 0;
  }

  if (firstValue === null || firstValue === undefined) {
    return 1;
  }

  if (secondValue === null || secondValue === undefined) {
    return -1;
  }

  const firstNumber = Number(firstValue);
  const secondNumber = Number(secondValue);

  if (!Number.isNaN(firstNumber) && !Number.isNaN(secondNumber)) {
    return (firstNumber - secondNumber) * directionMultiplier;
  }

  const firstDate = Date.parse(String(firstValue));
  const secondDate = Date.parse(String(secondValue));

  if (!Number.isNaN(firstDate) && !Number.isNaN(secondDate)) {
    return (firstDate - secondDate) * directionMultiplier;
  }

  return String(firstValue)
    .localeCompare(String(secondValue))
    * directionMultiplier;
}

function getRowKey<T extends object>(row: T, index: number): string | number {
  const record = row as { id?: string | number };

  return record.id ?? index;
}