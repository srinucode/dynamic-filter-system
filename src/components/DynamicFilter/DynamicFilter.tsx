import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Plus, RotateCcw } from "lucide-react";
import type {
  FilterCondition,
  FilterFieldConfig,
  FilterValue,
  Operator,
} from "../../lib/filtering/filter.types";
import { operatorsByFieldType } from "../../lib/filtering/filterOperators";
import { validateFilterCondition } from "../../lib/filtering/filterValidation";
import { FilterRow } from "./FilterRow";

interface DynamicFilterProps {
  fields: FilterFieldConfig[];
  filters: FilterCondition[];
  onAddFilter: (filter: FilterCondition) => void;
  onUpdateFilter: (filter: FilterCondition) => void;
  onRemoveFilter: (filterId: string) => void;
  onClearFilters: () => void;
}

export function DynamicFilter({
  fields,
  filters,
  onAddFilter,
  onUpdateFilter,
  onRemoveFilter,
  onClearFilters,
}: DynamicFilterProps) {
  function handleAddFilter() {
    const firstField = fields[0];

    if (!firstField) {
      return;
    }

    const defaultOperator = operatorsByFieldType[firstField.type][0];

    onAddFilter({
      id: crypto.randomUUID(),
      fieldKey: firstField.key,
      operator: defaultOperator,
      value: getDefaultValue(firstField, defaultOperator),
    });
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Advanced Filters
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Add field-based filters using dynamic operators and inputs.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RotateCcw size={16} />}
            onClick={onClearFilters}
            disabled={filters.length === 0}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={handleAddFilter}
          >
            Add Filter
          </Button>
        </Stack>
      </Box>

      {filters.length === 0 ? (
        <Box
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          No advanced filters added. Use “Add Filter” to filter by a specific
          field.
        </Box>
      ) : (
        <Stack spacing={2}>
          {filters.map((filter) => (
            <FilterRow
              key={filter.id}
              filter={filter}
              fields={fields}
              error={validateFilterCondition(filter, fields)}
              onChange={onUpdateFilter}
              onRemove={onRemoveFilter}
            />
          ))}
        </Stack>
      )}
    </Paper>
  );
}

function getDefaultValue(
  field: FilterFieldConfig,
  operator: Operator
): FilterValue {
  if (operator === "between") {
    return { min: "", max: "" };
  }

  switch (field.type) {
    case "text":
    case "number":
    case "currency":
    case "date":
    case "singleSelect":
      return "";

    case "multiSelect":
      return [];

    case "boolean":
      return true;

    default:
      return "";
  }
}