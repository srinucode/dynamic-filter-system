export type FieldType =
  | "text"
  | "number"
  | "date"
  | "currency"
  | "singleSelect"
  | "multiSelect"
  | "boolean";

export type Operator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "between"
  | "is"
  | "isNot"
  | "in"
  | "notIn";

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: FieldType;
  options?: SelectOption[];
}

export interface RangeValue {
  min?: string | number;
  max?: string | number;
}

export type FilterValue =
  | string
  | number
  | boolean
  | Array<string | number | boolean>
  | RangeValue
  | null;

export interface FilterCondition {
  id: string;
  fieldKey: string;
  operator: Operator;
  value: FilterValue;
}

export interface FilterValidationError {
  filterId: string;
  message: string;
}