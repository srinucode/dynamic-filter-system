# Dynamic Filter Component System

A reusable, type-safe, configuration-driven dynamic filter system built using React 18, TypeScript, Vite, and Material UI.

The system can be integrated with different data tables by changing only the field configuration. It supports global search, advanced field-based filters, sorting, validation, filter persistence, and CSV export.

---

## Features

- React 18 + TypeScript + Vite
- Configuration-driven filter system
- Reusable filter components
- Global keyword search
- Dynamic operator selection based on field type
- Dynamic input rendering based on selected field type
- Client-side filtering
- Sortable data table
- Total and filtered record counts
- Empty state for no matching results
- Nested object filtering using dot notation
- Array filtering for multi-select values
- Filter validation and error messages
- Filter persistence using localStorage
- Export filtered data to CSV

---

## Supported Filter Types

| Field Type | Supported Operators | Input Type |
|---|---|---|
| Text | Equals, Contains, Starts With, Ends With, Does Not Contain | Text input |
| Number | Equals, Not Equals, Greater Than, Less Than, Greater Than or Equal, Less Than or Equal, Between | Number input |
| Currency | Equals, Greater Than, Less Than, Greater Than or Equal, Less Than or Equal, Between | Number input |
| Date | Between | Date range input |
| Single Select | Is, Is Not | Dropdown |
| Multi Select | In, Not In | Multi-select dropdown |
| Boolean | Is | Toggle switch |

---

## Project Structure

```txt
src/
├── components/
│   ├── DataTable/
│   └── DynamicFilter/
├── features/
│   └── employees/
├── hooks/
│   └── useFilters.ts
├── lib/
│   ├── filtering/
│   └── utils/
└── theme/
```

---

## Core Architecture

The application separates UI, state management, filtering logic, configuration, and data.

### 1. UI Components

The UI components are reusable and do not contain table-specific business logic.

```txt
components/DataTable
components/DynamicFilter
```

### 2. Filter Logic

Filtering logic is implemented as pure utility functions.

```txt
lib/filtering/filterEngine.ts
lib/filtering/globalSearch.ts
lib/filtering/getValueByPath.ts
lib/filtering/filterValidation.ts
```

### 3. Feature Configuration

Employee-specific configuration is isolated inside:

```txt
features/employees/employee.config.ts
features/employees/employee.columns.tsx
features/employees/employee.data.ts
features/employees/employee.types.ts
```

This makes the filter system reusable with another table by replacing only the configuration and data.

---

## Filtering Behavior

The filter engine follows this rule:

```txt
AND between different fields
OR within the same field
```

Example:

```txt
Department is Engineering OR Department is Finance
AND
Salary greater than 70000
AND
Active Status is true
```

This means the final result must satisfy all different field groups, while multiple filters for the same field are treated as alternatives.

---

## Nested Field Support

Nested object filtering is supported using dot notation.

Example:

```ts
{
  key: "address.city",
  label: "City",
  type: "singleSelect"
}
```

The utility function `getValueByPath` resolves nested values like:

```ts
getValueByPath(employee, "address.city");
```

---

## Dataset

The application uses 60 employee records with varied data types:

- Text: name, email, department, role
- Number: salary, projects, performanceRating
- Date: joinDate, lastReview
- Boolean: isActive
- Array: skills
- Nested object: address.city, address.state, address.country

---

## Usage Example

A table can define its filter configuration like this:

```ts
export const employeeFilterConfig = [
  {
    key: "name",
    label: "Name",
    type: "text",
  },
  {
    key: "department",
    label: "Department",
    type: "singleSelect",
    options: [
      { label: "Engineering", value: "Engineering" },
      { label: "Finance", value: "Finance" },
    ],
  },
  {
    key: "salary",
    label: "Salary",
    type: "currency",
  },
  {
    key: "address.city",
    label: "City",
    type: "singleSelect",
    options: [
      { label: "Bangalore", value: "Bangalore" },
      { label: "New York", value: "New York" },
    ],
  },
];
```

Then pass the configuration to the reusable filter component:

```tsx
<DynamicFilter
  fields={employeeFilterConfig}
  filters={filters}
  onAddFilter={addFilter}
  onUpdateFilter={updateFilter}
  onRemoveFilter={removeFilter}
  onClearFilters={clearFilters}
/>
```

---

## Setup Instructions

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

---

## Assumptions

- The application uses client-side filtering for the provided mock employee dataset.
- Filter state is persisted in localStorage.
- Global search is applied before advanced filters.
- The CSV export downloads only the currently visible filtered records.
- Dot notation is used for nested object fields such as `address.city`.

---

## Bonus Features Implemented

- Global search
- Filter persistence
- CSV export
- Validation messages
- Sortable table
- Empty state
- Nested object filtering
- Array filtering
- Clean separation of concerns

---

## Tech Stack

- React 18
- TypeScript
- Vite
- Material UI
- Lucide React
- localStorage