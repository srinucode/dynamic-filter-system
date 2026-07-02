import type {
  FilterCondition,
  FilterFieldConfig,
  FilterValue,
  RangeValue,
} from "./filter.types";

export function validateFilterCondition(
  filter: FilterCondition,
  fields: FilterFieldConfig[]
): string | null {
  const field = fields.find((item) => item.key === filter.fieldKey);

  if (!field) {
    return "Please select a valid field.";
  }

  if (!filter.operator) {
    return "Please select an operator.";
  }

  if (isRangeValue(filter.value)) {
    return validateRangeValue(filter.value, field);
  }

  if (Array.isArray(filter.value)) {
    return filter.value.length === 0 ? "Please select at least one value." : null;
  }

  if (field.type === "boolean") {
    return null;
  }

  if (
    filter.value === null ||
    filter.value === undefined ||
    String(filter.value).trim() === ""
  ) {
    return "Please enter a value.";
  }

  if (
    (field.type === "number" || field.type === "currency") &&
    Number.isNaN(Number(filter.value))
  ) {
    return "Please enter a valid number.";
  }

  return null;
}

function validateRangeValue(
  value: RangeValue,
  field: FilterFieldConfig
): string | null {
  const hasMin = value.min !== undefined && value.min !== "";
  const hasMax = value.max !== undefined && value.max !== "";

  if (!hasMin && !hasMax) {
    return "Please enter at least one range value.";
  }

  if (field.type === "number" || field.type === "currency") {
    const min = hasMin ? Number(value.min) : null;
    const max = hasMax ? Number(value.max) : null;

    if ((hasMin && Number.isNaN(min)) || (hasMax && Number.isNaN(max))) {
      return "Please enter valid numeric range values.";
    }

    if (min !== null && max !== null && min > max) {
      return "Minimum value cannot be greater than maximum value.";
    }
  }

  if (field.type === "date") {
    const minDate = hasMin ? Date.parse(String(value.min)) : null;
    const maxDate = hasMax ? Date.parse(String(value.max)) : null;

    if (
      (hasMin && Number.isNaN(minDate)) ||
      (hasMax && Number.isNaN(maxDate))
    ) {
      return "Please enter valid date range values.";
    }

    if (minDate !== null && maxDate !== null && minDate > maxDate) {
      return "Start date cannot be after end date.";
    }
  }

  return null;
}

function isRangeValue(value: FilterValue): value is RangeValue {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("min" in value || "max" in value)
  );
}