/**
 * Safely reads a nested value from an object using dot notation.
 *
 * Example:
 * getValueByPath(employee, "address.city")
 * returns employee.address.city
 *
 * This keeps filtering logic generic and avoids hardcoding
 * table-specific field access inside the filter engine.
 */
export function getValueByPath<T extends object>(
  row: T,
  path: string
): unknown {
  return path.split(".").reduce<unknown>((currentValue, key) => {
    if (
      currentValue !== null &&
      typeof currentValue === "object" &&
      key in currentValue
    ) {
      return (currentValue as Record<string, unknown>)[key];
    }

    return undefined;
  }, row);
}