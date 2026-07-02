import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import type {
  FilterFieldConfig,
  FilterValue,
  RangeValue,
} from "../../lib/filtering/filter.types";

interface FilterValueInputProps {
  field: FilterFieldConfig;
  operator: string;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export function FilterValueInput({
  field,
  operator,
  value,
  onChange,
}: FilterValueInputProps) {
  if (operator === "between") {
    return (
      <RangeInput
        field={field}
        value={isRangeValue(value) ? value : { min: "", max: "" }}
        onChange={onChange}
      />
    );
  }

  switch (field.type) {
    case "text":
      return (
        <TextField
          fullWidth
          size="small"
          label="Value"
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );

    case "number":
    case "currency":
      return (
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Value"
          value={typeof value === "number" || typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );

    case "date":
      return (
        <TextField
          fullWidth
          size="small"
          type="date"
          label="Date"
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      );

    case "singleSelect":
      return (
        <FormControl fullWidth size="small">
          <InputLabel>Value</InputLabel>
          <Select
            label="Value"
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
          >
            {field.options?.map((option) => (
              <MenuItem key={String(option.value)} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case "multiSelect": {
      const selectedValues = Array.isArray(value) ? value.map(String) : [];

      return (
        <FormControl fullWidth size="small">
          <InputLabel>Values</InputLabel>
          <Select
            multiple
            value={selectedValues}
            input={<OutlinedInput label="Values" />}
            renderValue={(selected) => selected.join(", ")}
            onChange={(event) => {
              const selected = event.target.value;
              onChange(typeof selected === "string" ? selected.split(",") : selected);
            }}
          >
            {field.options?.map((option) => (
              <MenuItem key={String(option.value)} value={String(option.value)}>
                <Checkbox checked={selectedValues.includes(String(option.value))} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    case "boolean":
      return (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(value)}
              onChange={(event) => onChange(event.target.checked)}
            />
          }
          label={value ? "True" : "False"}
        />
      );

    default:
      return null;
  }
}

interface RangeInputProps {
  field: FilterFieldConfig;
  value: RangeValue;
  onChange: (value: FilterValue) => void;
}

function RangeInput({ field, value, onChange }: RangeInputProps) {
  const inputType = field.type === "date" ? "date" : "number";

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        fullWidth
        size="small"
        type={inputType}
        label="Min"
        value={value.min ?? ""}
        onChange={(event) =>
          onChange({
            ...value,
            min: event.target.value,
          })
        }
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        fullWidth
        size="small"
        type={inputType}
        label="Max"
        value={value.max ?? ""}
        onChange={(event) =>
          onChange({
            ...value,
            max: event.target.value,
          })
        }
        slotProps={{ inputLabel: { shrink: true } }}
      />
    </Box>
  );
}

function isRangeValue(value: FilterValue): value is RangeValue {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("min" in value || "max" in value)
  );
}