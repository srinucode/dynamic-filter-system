import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import { DataTable } from "./components/DataTable";
import { DynamicFilter } from "./components/DynamicFilter";
import {
  employeeTableDefinition,
  transactionTableDefinition,
  type DatasetKey,
  type TableDefinition,
} from "./app/tableDefinitions";
import { useFilters } from "./hooks/useFilters";
import { exportToCsv } from "./lib/utils/exportCsv";
import { ActiveFilterChips } from "./components/DynamicFilter/ActiveFilterChips";

function App() {
  const [selectedDataset, setSelectedDataset] =
    useState<DatasetKey>("employees");
    

  return (
    <>
      <CssBaseline />

      {selectedDataset === "employees" ? (
        <DatasetWorkspace
          selectedDataset={selectedDataset}
          onDatasetChange={setSelectedDataset}
          definition={employeeTableDefinition}
        />
      ) : (
        <DatasetWorkspace
          selectedDataset={selectedDataset}
          onDatasetChange={setSelectedDataset}
          definition={transactionTableDefinition}
        />
      )}
    </>
  );
}

interface DatasetWorkspaceProps<T extends object> {
  selectedDataset: DatasetKey;
  onDatasetChange: (dataset: DatasetKey) => void;
  definition: TableDefinition<T>;
}

function DatasetWorkspace<T extends object>({
  selectedDataset,
  onDatasetChange,
  definition,
}: DatasetWorkspaceProps<T>) {
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
    resetAll,
  } = useFilters({
    data: definition.data,
    filterFields: definition.filterConfig,
    searchableFields: definition.searchableFields,
    storageKey: definition.storageKey,
  });

  function handleExportCsv() {
    exportToCsv(
      definition.exportFileName,
      filteredData,
      definition.csvColumns
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 3,
          }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
              Dynamic Filter Component System
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {definition.description}
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Dataset</InputLabel>
              <Select
                label="Dataset"
                value={selectedDataset}
                onChange={(event) =>
                  onDatasetChange(event.target.value as DatasetKey)
                }
              >
                <MenuItem value="employees">Employees</MenuItem>
                <MenuItem value="transactions">Transactions</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<Download size={16} />}
              onClick={handleExportCsv}
              disabled={filteredData.length === 0}
            >
              Export CSV
            </Button>
            <Button
  variant="outlined"
  color="error"
  onClick={resetAll}
  disabled={!searchQuery && filters.length === 0}
>
  Reset All
</Button>
          </Stack>
        </Stack>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={definition.searchPlaceholder}
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
          <Typography variant="body2" color="text.secondary">
  Active filters: {filters.length} | Showing {filteredCount} of {totalCount}
</Typography>
        </Box>
        <ActiveFilterChips
  filters={filters}
  fields={definition.filterConfig}
  onRemoveFilter={removeFilter}
/>

        <DynamicFilter
          fields={definition.filterConfig}
          filters={filters}
          onAddFilter={addFilter}
          onUpdateFilter={updateFilter}
          onRemoveFilter={removeFilter}
          onClearFilters={clearFilters}
        />

        <DataTable
          title={definition.title}
          data={filteredData}
          columns={definition.columns}
          totalCount={totalCount}
          filteredCount={filteredCount}
          emptyMessage={definition.emptyMessage}
        />
      </Box>
    </Container>
  );
}

export default App;