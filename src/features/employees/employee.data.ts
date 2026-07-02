import type { Employee } from "./employee.types";

const firstNames = [
  "John",
  "Amit",
  "Priya",
  "Sarah",
  "Michael",
  "Neha",
  "David",
  "Ananya",
  "Rahul",
  "Emily",
];

const lastNames = [
  "Smith",
  "Kumar",
  "Sharma",
  "Brown",
  "Johnson",
  "Reddy",
  "Patel",
  "Williams",
  "Gupta",
  "Davis",
];

const departments = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Sales",
  "Marketing",
  "Operations",
];

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "QA Engineer",
  "DevOps Engineer",
  "Data Analyst",
  "HR Manager",
];

const skillPool = [
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
];

const cities = [
  { city: "San Francisco", state: "CA", country: "USA" },
  { city: "New York", state: "NY", country: "USA" },
  { city: "Bangalore", state: "KA", country: "India" },
  { city: "Hyderabad", state: "TS", country: "India" },
  { city: "London", state: "England", country: "UK" },
  { city: "Toronto", state: "ON", country: "Canada" },
];

function getEmployeeSkills(index: number): string[] {
  const firstSkill = skillPool[index % skillPool.length];
  const secondSkill = skillPool[(index + 2) % skillPool.length];
  const thirdSkill = skillPool[(index + 4) % skillPool.length];

  return Array.from(new Set([firstSkill, secondSkill, thirdSkill]));
}

function createEmployee(index: number): Employee {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];
  const department = departments[index % departments.length];
  const role = roles[index % roles.length];
  const address = cities[index % cities.length];

  const year = 2019 + (index % 6);
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String((index % 28) + 1).padStart(2, "0");

  return {
    id: index + 1,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@company.com`,
    department,
    role,
    salary: 50000 + index * 1800,
    joinDate: `${year}-${month}-${day}`,
    isActive: index % 3 !== 0,
    skills: getEmployeeSkills(index),
    address,
    projects: (index % 8) + 1,
    lastReview: `2024-${month}-${day}`,
    performanceRating: Number((3 + (index % 20) / 10).toFixed(1)),
  };
}

export const employeeData: Employee[] = Array.from(
  { length: 60 },
  (_, index) => createEmployee(index)
);