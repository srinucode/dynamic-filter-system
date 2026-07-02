import React from "react";
import { Chip } from "@mui/material";
import type { DataTableColumn } from "../../components/DataTable";
import { formatCurrency, formatDate } from "../../lib/utils/formatters";
import type { Transaction } from "./transaction.types";

export const transactionColumns: DataTableColumn<Transaction>[] = [
  {
    key: "id",
    header: "ID",
    sortable: true,
    align: "right",
  },
  {
    key: "transactionId",
    header: "Transaction ID",
    sortable: true,
  },
  {
    key: "customerName",
    header: "Customer",
    sortable: true,
  },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    align: "right",
    renderCell: (transaction: Transaction) => formatCurrency(transaction.amount),
  },
  {
    key: "paymentMethod",
    header: "Payment Method",
    sortable: true,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    renderCell: (transaction: Transaction) =>
      React.createElement(Chip, {
        label: transaction.status,
        color: transaction.status === "Success" ? "success" : "default",
        size: "small",
      }),
  },
  {
    key: "isRefunded",
    header: "Refunded",
    sortable: true,
    renderCell: (transaction: Transaction) =>
      React.createElement(Chip, {
        label: transaction.isRefunded ? "Yes" : "No",
        color: transaction.isRefunded ? "warning" : "default",
        size: "small",
      }),
  },
  {
    key: "createdAt",
    header: "Created At",
    sortable: true,
    renderCell: (transaction: Transaction) => String(formatDate(transaction.createdAt) ?? ""),
  },
  {
    key: "tags",
    header: "Tags",
    sortable: false,
    renderCell: (transaction: Transaction) => transaction.tags.join(", "),
  },
  {
    key: "location.city",
    header: "City",
    sortable: true,
  },
  {
    key: "riskScore",
    header: "Risk Score",
    sortable: true,
    align: "right",
  },
];