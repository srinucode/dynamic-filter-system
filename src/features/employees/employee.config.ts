import type {
  FilterFieldConfig,
  SelectOption,
} from "../../lib/filtering/filter.types";

function createOptions<T extends string | number | boolean>(
  values: readonly T[]
): SelectOption[] {
  return values.map((value) => ({
    label: String(value),
    value,
  }));
}

export const employeeFilterConfig: FilterFieldConfig[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
  },
  {
    key: "email",
    label: "Email",
    type: "text",
  },
  {
    key: "department",
    label: "Department",
    type: "singleSelect",
    options: createOptions([
      "Engineering",
      "Human Resources",
      "Finance",
      "Sales",
      "Marketing",
      "Operations",
    ]),
  },
  {
    key: "role",
    label: "Role",
    type: "singleSelect",
    options: createOptions([
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Product Manager",
      "QA Engineer",
      "DevOps Engineer",
      "Data Analyst",
      "HR Manager",
    ]),
  },
  {
    key: "salary",
    label: "Salary",
    type: "currency",
  },
  {
    key: "joinDate",
    label: "Join Date",
    type: "date",
  },
  {
    key: "isActive",
    label: "Active Status",
    type: "boolean",
  },
  {
    key: "skills",
    label: "Skills",
    type: "multiSelect",
    options: createOptions([
      "React",
      "TypeScript",
      "Node.js",
      "GraphQL",
      "Java",
      "Spring Boot",
      "Python",
      "SQL",
      "AWS",
      "Docker",
    ]),
  },
  {
    key: "address.city",
    label: "City",
    type: "singleSelect",
    options: createOptions([
      "San Francisco",
      "New York",
      "Bangalore",
      "Hyderabad",
      "London",
      "Toronto",
    ]),
  },
  {
    key: "address.country",
    label: "Country",
    type: "singleSelect",
    options: createOptions(["USA", "India", "UK", "Canada"]),
  },
  {
    key: "projects",
    label: "Projects",
    type: "number",
  },
  {
    key: "performanceRating",
    label: "Performance Rating",
    type: "number",
  },
];
export const employeeSearchableFields = [
  { key: "name" },
  { key: "email" },
  { key: "department" },
  { key: "role" },
  { key: "skills" },
  { key: "address.city" },
  { key: "address.state" },
  { key: "address.country" },
];