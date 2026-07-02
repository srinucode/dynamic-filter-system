import type { DataTableColumn } from "../components/DataTable";
import { employeeColumns } from "../features/employees/employee.columns";
import {
  employeeFilterConfig,
  employeeSearchableFields,
} from "../features/employees/employee.config";
import { employeeData } from "../features/employees/employee.data";
import type { Employee } from "../features/employees/employee.types";
import { transactionColumns } from "../features/transactions/transaction.columns";
import {
  transactionFilterConfig,
  transactionSearchableFields,
} from "../features/transactions/transaction.config";
import { transactionData } from "../features/transactions/transaction.data";
import type { Transaction } from "../features/transactions/transaction.types";
import type { SearchField } from "../lib/filtering/globalSearch";
import type { FilterFieldConfig } from "../lib/filtering/filter.types";
import type { CsvColumn } from "../lib/utils/exportCsv";

export type DatasetKey = "employees" | "transactions";

export interface TableDefinition<T extends object> {
  key: DatasetKey;
  label: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  emptyMessage: string;
  exportFileName: string;
  storageKey: string;
  data: T[];
  columns: DataTableColumn<T>[];
  filterConfig: FilterFieldConfig[];
  searchableFields: SearchField[];
  csvColumns: CsvColumn<T>[];
}

export const employeeTableDefinition: TableDefinition<Employee> = {
  key: "employees",
  label: "Employees",
  title: "Employee Records",
  description: "Reusable React TypeScript filtering system for employee data.",
  searchPlaceholder:
    "Search by name, email, department, role, skill, city, or country...",
  emptyMessage: "No employees match your filters.",
  exportFileName: "employee-records.csv",
  storageKey: "employee-filter-state",
  data: employeeData,
  columns: employeeColumns,
  filterConfig: employeeFilterConfig,
  searchableFields: employeeSearchableFields,
  csvColumns: [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "department", header: "Department" },
    { key: "role", header: "Role" },
    { key: "salary", header: "Salary" },
    { key: "joinDate", header: "Join Date" },
    {
      key: "isActive",
      header: "Status",
      renderValue: (employee) => (employee.isActive ? "Active" : "Inactive"),
    },
    {
      key: "skills",
      header: "Skills",
      renderValue: (employee) => employee.skills.join("; "),
    },
    { key: "address.city", header: "City" },
    { key: "address.country", header: "Country" },
    { key: "projects", header: "Projects" },
    { key: "performanceRating", header: "Performance Rating" },
  ],
};

export const transactionTableDefinition: TableDefinition<Transaction> = {
  key: "transactions",
  label: "Transactions",
  title: "Transaction Records",
  description:
    "Testing the same reusable filter system with transaction data.",
  searchPlaceholder:
    "Search by transaction ID, customer, payment method, status, tag, city, or country...",
  emptyMessage: "No transactions match your filters.",
  exportFileName: "transaction-records.csv",
  storageKey: "transaction-filter-state",
  data: transactionData,
  columns: transactionColumns,
  filterConfig: transactionFilterConfig,
  searchableFields: transactionSearchableFields,
  csvColumns: [
    { key: "id", header: "ID" },
    { key: "transactionId", header: "Transaction ID" },
    { key: "customerName", header: "Customer" },
    { key: "amount", header: "Amount" },
    { key: "paymentMethod", header: "Payment Method" },
    { key: "status", header: "Status" },
    {
      key: "isRefunded",
      header: "Refunded",
      renderValue: (transaction) => (transaction.isRefunded ? "Yes" : "No"),
    },
    { key: "createdAt", header: "Created At" },
    {
      key: "tags",
      header: "Tags",
      renderValue: (transaction) => transaction.tags.join("; "),
    },
    { key: "location.city", header: "City" },
    { key: "location.country", header: "Country" },
    { key: "riskScore", header: "Risk Score" },
  ],
};