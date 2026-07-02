import {
  Alert,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import type {
  FilterCondition,
  FilterFieldConfig,
  FilterValue,
  Operator,
} from "../../lib/filtering/filter.types";
import {
  operatorLabels,
  operatorsByFieldType,
} from "../../lib/filtering/filterOperators";
import { FilterValueInput } from "./FilterValueInput";

interface FilterRowProps {
  filter: FilterCondition;
  fields: FilterFieldConfig[];
  error?: string | null;
  onChange: (filter: FilterCondition) => void;
  onRemove: (filterId: string) => void;
}

export function FilterRow({
  filter,
  fields,
  error,
  onChange,
  onRemove,
}: FilterRowProps) {
  const selectedField = fields.find((field) => field.key === filter.fieldKey);

  if (!selectedField) {
    return null;
  }

  const availableOperators = operatorsByFieldType[selectedField.type];

  function handleFieldChange(fieldKey: string) {
    const nextField = fields.find((field) => field.key === fieldKey);

    if (!nextField) {
      return;
    }

    const nextOperator = operatorsByFieldType[nextField.type][0];

    onChange({
      ...filter,
      fieldKey,
      operator: nextOperator,
      value: getDefaultValue(nextField, nextOperator),
    });
  }

  function handleOperatorChange(operator: Operator) {
    if (!selectedField) {
      return;
    }

    onChange({
      ...filter,
      operator,
      value: getDefaultValue(selectedField, operator),
    });
  }

  function handleValueChange(value: FilterValue) {
    onChange({
      ...filter,
      value,
    });
  }

  return (
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1.2fr 1.2fr 1.8fr auto",
        },
        gap: 2,
        alignItems: "center",
      }}
    >
      <FormControl fullWidth size="small">
        <InputLabel>Field</InputLabel>
        <Select
          label="Field"
          value={filter.fieldKey}
          onChange={(event) => handleFieldChange(event.target.value)}
        >
          {fields.map((field) => (
            <MenuItem key={field.key} value={field.key}>
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Operator</InputLabel>
        <Select
          label="Operator"
          value={filter.operator}
          onChange={(event) =>
            handleOperatorChange(event.target.value as Operator)
          }
        >
          {availableOperators.map((operator) => (
            <MenuItem key={operator} value={operator}>
              {operatorLabels[operator]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FilterValueInput
        field={selectedField}
        operator={filter.operator}
        value={filter.value}
        onChange={handleValueChange}
      />

      <Box sx={{ textAlign: "right" }}>
        <IconButton
          color="error"
          aria-label="Remove filter"
          onClick={() => onRemove(filter.id)}
        >
          <Trash2 size={18} />
        </IconButton>
      </Box>
    </Box>

    {error ? (
      <Alert severity="warning" sx={{ mt: 2 }}>
        {error}
      </Alert>
    ) : null}
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