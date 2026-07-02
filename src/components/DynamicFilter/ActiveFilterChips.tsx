import { Box, Chip } from "@mui/material";
import type {
  FilterCondition,
  FilterFieldConfig,
} from "../../lib/filtering/filter.types";
import { operatorLabels } from "../../lib/filtering/filterOperators";

interface ActiveFilterChipsProps {
  filters: FilterCondition[];
  fields: FilterFieldConfig[];
  onRemoveFilter: (filterId: string) => void;
}

export function ActiveFilterChips({
  filters,
  fields,
  onRemoveFilter,
}: ActiveFilterChipsProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
      {filters.map((filter) => {
        const field = fields.find((item) => item.key === filter.fieldKey);

        return (
          <Chip
            key={filter.id}
            label={`${field?.label ?? filter.fieldKey} ${
              operatorLabels[filter.operator]
            } ${formatFilterValue(filter.value)}`}
            onDelete={() => onRemoveFilter(filter.id)}
            variant="outlined"
          />
        );
      })}
    </Box>
  );
}

function formatFilterValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (
    value !== null &&
    typeof value === "object" &&
    ("min" in value || "max" in value)
  ) {
    const range = value as { min?: unknown; max?: unknown };
    return `${range.min ?? "Any"} - ${range.max ?? "Any"}`;
  }

  return String(value);
}