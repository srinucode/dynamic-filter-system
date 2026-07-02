import { getValueByPath } from "./getValueByPath";

export interface SearchField {
  key: string;
}

/**
 * Applies a case-insensitive keyword search across configured fields.
 *
 * This is intentionally separate from the advanced filter engine because:
 * - Global search checks many fields at once.
 * - Advanced filters apply field-specific operators.
 *
 * Keeping them separate makes the filtering behavior easier to maintain.
 */
export function applyGlobalSearch<T extends object>(
  data: T[],
  searchQuery: string,
  searchableFields: SearchField[]
): T[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return data;
  }

  return data.filter((row) => {
    return searchableFields.some((field) => {
      const value = getValueByPath(row, field.key);
      return valueMatchesSearch(value, normalizedQuery);
    });
  });
}

function valueMatchesSearch(value: unknown, searchQuery: string): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item) => valueMatchesSearch(item, searchQuery));
  }

  if (typeof value === "object") {
    return Object.values(value).some((nestedValue) =>
      valueMatchesSearch(nestedValue, searchQuery)
    );
  }

  return String(value).toLowerCase().includes(searchQuery);
}