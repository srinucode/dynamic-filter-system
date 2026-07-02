import {
  Box,
  Button,
  Container,
  CssBaseline,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Download, Search } from "lucide-react";
import { DataTable } from "./components/DataTable";
import { DynamicFilter } from "./components/DynamicFilter";
import { employeeColumns } from "./features/employees/employee.columns";
import {
  employeeFilterConfig,
  employeeSearchableFields,
} from "./features/employees/employee.config";
import { employeeData } from "./features/employees/employee.data";
import { useFilters } from "./hooks/useFilters";
import { exportToCsv } from "./lib/utils/exportCsv";

function App() {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    filteredData,
    totalCount,
    filteredCount,
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
  } = useFilters({
    data: employeeData,
    filterFields: employeeFilterConfig,
    searchableFields: employeeSearchableFields,
    storageKey: "employee-filter-state",
  });

  function handleExportCsv() {
    exportToCsv("employee-records.csv", filteredData, [
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
    ]);
  }

  return (
    <>
      <CssBaseline />

      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
                Dynamic Filter Component System
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Reusable React TypeScript filtering system for employee data.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Download size={16} />}
              onClick={handleExportCsv}
              disabled={filteredData.length === 0}
            >
              Export CSV
            </Button>
          </Stack>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, email, department, role, skill, city, or country..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <DynamicFilter
            fields={employeeFilterConfig}
            filters={filters}
            onAddFilter={addFilter}
            onUpdateFilter={updateFilter}
            onRemoveFilter={removeFilter}
            onClearFilters={clearFilters}
          />

          <DataTable
            data={filteredData}
            columns={employeeColumns}
            totalCount={totalCount}
            filteredCount={filteredCount}
            emptyMessage="No employees match your filters."
          />
        </Box>
      </Container>
    </>
  );
}

export default App;