import type { FieldType, Operator } from "./filter.types";

export const operatorsByFieldType: Record<FieldType, Operator[]> = {
  text: ["equals", "contains", "startsWith", "endsWith", "notContains"],

  number: [
    "equals",
    "notEquals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
    "between",
  ],

  currency: [
    "equals",
    "greaterThan",
    "lessThan",
    "greaterThanOrEqual",
    "lessThanOrEqual",
    "between",
  ],

  date: ["between"],

  singleSelect: ["is", "isNot"],

  multiSelect: ["in", "notIn"],

  boolean: ["is"],
};

export const operatorLabels: Record<Operator, string> = {
  equals: "Equals",
  notEquals: "Does Not Equal",
  contains: "Contains",
  notContains: "Does Not Contain",
  startsWith: "Starts With",
  endsWith: "Ends With",
  greaterThan: "Greater Than",
  lessThan: "Less Than",
  greaterThanOrEqual: "Greater Than or Equal",
  lessThanOrEqual: "Less Than or Equal",
  between: "Between",
  is: "Is",
  isNot: "Is Not",
  in: "In",
  notIn: "Not In",
};