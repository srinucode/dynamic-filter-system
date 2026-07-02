import type {
  FilterFieldConfig,
  SelectOption,
} from "../../lib/filtering/filter.types";

function createOptions<T extends string | number | boolean>(
  values: readonly T[]
): SelectOption[] {
  return values.map((value) => ({
    label: String(value),
    value,
  }));
}

export const transactionFilterConfig: FilterFieldConfig[] = [
  {
    key: "transactionId",
    label: "Transaction ID",
    type: "text",
  },
  {
    key: "customerName",
    label: "Customer Name",
    type: "text",
  },
  {
    key: "amount",
    label: "Amount",
    type: "currency",
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
    type: "singleSelect",
    options: createOptions(["Card", "Bank Transfer", "UPI", "Wallet"]),
  },
  {
    key: "status",
    label: "Status",
    type: "singleSelect",
    options: createOptions(["Success", "Pending", "Failed"]),
  },
  {
    key: "isRefunded",
    label: "Refunded",
    type: "boolean",
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
  },
  {
    key: "tags",
    label: "Tags",
    type: "multiSelect",
    options: createOptions([
      "Subscription",
      "Refund",
      "High Value",
      "International",
      "Recurring",
    ]),
  },
  {
    key: "location.city",
    label: "City",
    type: "singleSelect",
    options: createOptions([
      "Bangalore",
      "Hyderabad",
      "New York",
      "London",
      "Toronto",
    ]),
  },
  {
    key: "location.country",
    label: "Country",
    type: "singleSelect",
    options: createOptions(["India", "USA", "UK", "Canada"]),
  },
  {
    key: "riskScore",
    label: "Risk Score",
    type: "number",
  },
];

export const transactionSearchableFields = [
  { key: "transactionId" },
  { key: "customerName" },
  { key: "paymentMethod" },
  { key: "status" },
  { key: "tags" },
  { key: "location.city" },
  { key: "location.country" },
];