import type {
  FilterCondition,
  FilterFieldConfig,
  FilterValue,
  RangeValue,
} from "./filter.types";
import { getValueByPath } from "./getValueByPath";

/**
 * Applies active filters to a dataset.
 *
 * Filtering rules:
 * - Different fields are combined using AND.
 * - Multiple filters for the same field are combined using OR.
 *
 * Example:
 * department = Engineering OR department = Finance
 * AND
 * isActive = true
 *
 * This function is intentionally UI-independent so it can be reused
 * with any table, dataset, or component.
 */
export function applyFilters<T extends object>(
  data: T[],
  filters: FilterCondition[],
  fields: FilterFieldConfig[]
): T[] {
  const activeFilters = filters.filter(isFilterReady);

  if (activeFilters.length === 0) {
    return data;
  }

  const filtersByField = groupFiltersByField(activeFilters);
  const fieldConfigMap = createFieldConfigMap(fields);

  return data.filter((row) => {
    return Object.entries(filtersByField).every(([fieldKey, fieldFilters]) => {
      const fieldConfig = fieldConfigMap.get(fieldKey);

      if (!fieldConfig) {
        return true;
      }

      const rowValue = getValueByPath(row, fieldKey);

      // OR logic within the same field.
      return fieldFilters.some((filter) =>
        evaluateCondition(rowValue, filter, fieldConfig)
      );
    });
  });
}

function createFieldConfigMap(
  fields: FilterFieldConfig[]
): Map<string, FilterFieldConfig> {
  return new Map(fields.map((field) => [field.key, field]));
}

function groupFiltersByField(
  filters: FilterCondition[]
): Record<string, FilterCondition[]> {
  return filters.reduce<Record<string, FilterCondition[]>>((acc, filter) => {
    acc[filter.fieldKey] ??= [];
    acc[filter.fieldKey].push(filter);
    return acc;
  }, {});
}

function isFilterReady(filter: FilterCondition): boolean {
  if (!filter.fieldKey || !filter.operator) {
    return false;
  }

  if (filter.value === null || filter.value === undefined) {
    return false;
  }

  if (typeof filter.value === "string") {
    return filter.value.trim().length > 0;
  }

  if (Array.isArray(filter.value)) {
    return filter.value.length > 0;
  }

 
  if (isRangeValue(filter.value)) {
  const hasMin = filter.value.min !== undefined && filter.value.min !== "";
  const hasMax = filter.value.max !== undefined && filter.value.max !== "";

  return hasMin || hasMax;
}

  return true;
}

function evaluateCondition(
  rowValue: unknown,
  filter: FilterCondition,
  fieldConfig: FilterFieldConfig
): boolean {
  switch (filter.operator) {
    case "equals":
      return normalize(rowValue) === normalize(filter.value);

    case "notEquals":
      return normalize(rowValue) !== normalize(filter.value);

    case "contains":
      return normalize(rowValue).includes(normalize(filter.value));

    case "notContains":
      return !normalize(rowValue).includes(normalize(filter.value));

    case "startsWith":
      return normalize(rowValue).startsWith(normalize(filter.value));

    case "endsWith":
      return normalize(rowValue).endsWith(normalize(filter.value));

    case "greaterThan":
      return toComparableValue(rowValue, fieldConfig) >
        toComparableValue(filter.value, fieldConfig);

    case "lessThan":
      return toComparableValue(rowValue, fieldConfig) <
        toComparableValue(filter.value, fieldConfig);

    case "greaterThanOrEqual":
      return toComparableValue(rowValue, fieldConfig) >=
        toComparableValue(filter.value, fieldConfig);

    case "lessThanOrEqual":
      return toComparableValue(rowValue, fieldConfig) <=
        toComparableValue(filter.value, fieldConfig);

    case "between":
      return evaluateRange(rowValue, filter.value, fieldConfig);

    case "is":
      return rowValue === filter.value;

    case "isNot":
      return rowValue !== filter.value;

    case "in":
      return evaluateIn(rowValue, filter.value);

    case "notIn":
      return !evaluateIn(rowValue, filter.value);

    default:
      return true;
  }
}

function evaluateRange(
  rowValue: unknown,
  filterValue: FilterValue,
  fieldConfig: FilterFieldConfig
): boolean {
  if (!isRangeValue(filterValue)) {
    return false;
  }

  const value = toComparableValue(rowValue, fieldConfig);
  const min = filterValue.min;
  const max = filterValue.max;

  if (Number.isNaN(value)) {
    return false;
  }

  if (min !== undefined && min !== "") {
    const minValue = toComparableValue(min, fieldConfig);

    if (value < minValue) {
      return false;
    }
  }

  if (max !== undefined && max !== "") {
    const maxValue = toComparableValue(max, fieldConfig);

    if (value > maxValue) {
      return false;
    }
  }

  return true;
}

function evaluateIn(rowValue: unknown, filterValue: FilterValue): boolean {
  if (!Array.isArray(filterValue)) {
    return false;
  }

  if (Array.isArray(rowValue)) {
    return rowValue.some((item) => filterValue.includes(item));
  }

  return filterValue.includes(rowValue as string | number | boolean);
}

function toComparableValue(
  value: unknown,
  fieldConfig: FilterFieldConfig
): number {
  if (value === null || value === undefined || value === "") {
    return Number.NaN;
  }

  if (fieldConfig.type === "date") {
    return Date.parse(String(value));
  }

  return Number(value);
}

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function isRangeValue(value: FilterValue): value is RangeValue {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("min" in value || "max" in value)
  );
}