import { Chip } from "@mui/material";
import type { DataTableColumn } from "../../components/DataTable";
import { formatCurrency, formatDate } from "../../lib/utils/formatters";
import type { Employee } from "./employee.types";

export const employeeColumns: DataTableColumn<Employee>[] = [
  {
    key: "id",
    header: "ID",
    sortable: true,
    align: "right",
  },
  {
    key: "name",
    header: "Name",
    sortable: true,
  },
  {
    key: "email",
    header: "Email",
    sortable: true,
  },
  {
    key: "department",
    header: "Department",
    sortable: true,
  },
  {
    key: "role",
    header: "Role",
    sortable: true,
  },
  {
    key: "salary",
    header: "Salary",
    sortable: true,
    align: "right",
    renderCell: (employee) => formatCurrency(employee.salary),
  },
  {
    key: "joinDate",
    header: "Join Date",
    sortable: true,
    renderCell: (employee) => formatDate(employee.joinDate),
  },
  {
    key: "isActive",
    header: "Status",
    sortable: true,
    renderCell: (employee) => (
      <Chip
        label={employee.isActive ? "Active" : "Inactive"}
        color={employee.isActive ? "success" : "default"}
        size="small"
      />
    ),
  },
  {
    key: "skills",
    header: "Skills",
    sortable: false,
    renderCell: (employee) => employee.skills.join(", "),
  },
  {
    key: "address.city",
    header: "City",
    sortable: true,
  },
  {
    key: "projects",
    header: "Projects",
    sortable: true,
    align: "right",
  },
  {
    key: "performanceRating",
    header: "Rating",
    sortable: true,
    align: "right",
  },
];