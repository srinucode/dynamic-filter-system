import { useEffect, useMemo, useState } from "react";
import { applyFilters } from "../lib/filtering/filterEngine";
import { applyGlobalSearch } from "../lib/filtering/globalSearch";
import type {
  FilterCondition,
  FilterFieldConfig,
} from "../lib/filtering/filter.types";
import type { SearchField } from "../lib/filtering/globalSearch";
import { useDebouncedValue } from "./useDebouncedValue";

interface UseFiltersParams<T extends object> {
  data: T[];
  filterFields: FilterFieldConfig[];
  searchableFields: SearchField[];
  storageKey?: string;
}

interface PersistedFilterState {
  searchQuery: string;
  filters: FilterCondition[];
}

export function useFilters<T extends object>({
  data,
  filterFields,
  searchableFields,
  storageKey,
}: UseFiltersParams<T>) {
  const persistedState = getPersistedState(storageKey);

  const [searchQuery, setSearchQuery] = useState(
    persistedState?.searchQuery ?? ""
  );

  const [filters, setFilters] = useState<FilterCondition[]>(
    persistedState?.filters ?? []
  );
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  /**
   * Persist search and filters so the user does not lose their filtering
   * state after refreshing the page.
   */
  useEffect(() => {
    if (!storageKey) {
      return;
    }

    const stateToPersist: PersistedFilterState = {
      searchQuery,
      filters,
    };

    localStorage.setItem(storageKey, JSON.stringify(stateToPersist));
  }, [searchQuery, filters, storageKey]);

  /**
   * Global search runs before advanced filters.
   *
   * Example:
   * 1. User searches "react"
   * 2. Then applies Department = Engineering
   *
   * Final output contains only Engineering employees that also match "react".
   */
  const searchedData = useMemo(() => {
    return applyGlobalSearch(data, debouncedSearchQuery, searchableFields);
  }, [data, debouncedSearchQuery, searchableFields]);

  const filteredData = useMemo(() => {
    return applyFilters(searchedData, filters, filterFields);
  }, [searchedData, filters, filterFields]);

  function addFilter(filter: FilterCondition) {
    setFilters((previousFilters) => [...previousFilters, filter]);
  }

  function updateFilter(updatedFilter: FilterCondition) {
    setFilters((previousFilters) =>
      previousFilters.map((filter) =>
        filter.id === updatedFilter.id ? updatedFilter : filter
      )
    );
  }

  function removeFilter(filterId: string) {
    setFilters((previousFilters) =>
      previousFilters.filter((filter) => filter.id !== filterId)
    );
  }

  function clearFilters() {
    setFilters([]);
  }

  function clearSearch() {
    setSearchQuery("");
  }

  function resetAll() {
    setSearchQuery("");
    setFilters([]);

    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }

  return {
    searchQuery,
    setSearchQuery,

    filters,
    filteredData,

    totalCount: data.length,
    searchedCount: searchedData.length,
    filteredCount: filteredData.length,

    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    clearSearch,
    resetAll,
  };
}

function getPersistedState(storageKey?: string): PersistedFilterState | null {
  if (!storageKey) {
    return null;
  }

  try {
    const storedValue = localStorage.getItem(storageKey);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as PersistedFilterState;

    return {
      searchQuery: parsedValue.searchQuery ?? "",
      filters: Array.isArray(parsedValue.filters) ? parsedValue.filters : [],
    };
  } catch {
    return null;
  }
}