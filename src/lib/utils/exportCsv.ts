import { getValueByPath } from "../filtering/getValueByPath";

export interface CsvColumn<T extends object> {
  key: string;
  header: string;
  renderValue?: (row: T) => string | number | boolean;
}

/**
 * Converts the currently visible table data into a CSV file.
 *
 * The function is generic and does not know about employees directly.
 * It works with any dataset as long as columns are provided.
 */
export function exportToCsv<T extends object>(
  fileName: string,
  data: T[],
  columns: CsvColumn<T>[]
): void {
  const headers = columns.map((column) => escapeCsvValue(column.header));

  const rows = data.map((row) =>
    columns.map((column) => {
      const value = column.renderValue
        ? column.renderValue(row)
        : getValueByPath(row, column.key);

      return escapeCsvValue(formatCsvValue(value));
    })
  );

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  downloadCsv(fileName, csvContent);
}

function formatCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join("; ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function escapeCsvValue(value: string): string {
  const shouldEscape =
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r");

  if (!shouldEscape) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
}

function downloadCsv(fileName: string, csvContent: string): void {
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();

  URL.revokeObjectURL(url);
}