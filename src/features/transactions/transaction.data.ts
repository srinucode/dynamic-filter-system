import type { Transaction } from "./transaction.types";

const customers = [
  "John Smith",
  "Amit Kumar",
  "Priya Sharma",
  "Sarah Brown",
  "Michael Johnson",
  "Neha Reddy",
  "David Patel",
  "Ananya Williams",
];

const paymentMethods = ["Card", "Bank Transfer", "UPI", "Wallet"];
const statuses = ["Success", "Pending", "Failed"];
const tagPool = ["Subscription", "Refund", "High Value", "International", "Recurring"];

const locations = [
  { city: "Bangalore", country: "India" },
  { city: "Hyderabad", country: "India" },
  { city: "New York", country: "USA" },
  { city: "London", country: "UK" },
  { city: "Toronto", country: "Canada" },
];

function getTags(index: number): string[] {
  return [
    tagPool[index % tagPool.length],
    tagPool[(index + 2) % tagPool.length],
  ];
}

function createTransaction(index: number): Transaction {
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String((index % 28) + 1).padStart(2, "0");

  return {
    id: index + 1,
    transactionId: `TXN-${10000 + index}`,
    customerName: customers[index % customers.length],
    amount: 500 + index * 275,
    paymentMethod: paymentMethods[index % paymentMethods.length],
    status: statuses[index % statuses.length],
    isRefunded: index % 5 === 0,
    createdAt: `2024-${month}-${day}`,
    tags: getTags(index),
    location: locations[index % locations.length],
    riskScore: Number((1 + (index % 40) / 10).toFixed(1)),
  };
}

export const transactionData: Transaction[] = Array.from(
  { length: 60 },
  (_, index) => createTransaction(index)
);