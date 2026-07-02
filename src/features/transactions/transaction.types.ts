export interface TransactionLocation {
  city: string;
  country: string;
}

export interface Transaction {
  id: number;
  transactionId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  isRefunded: boolean;
  createdAt: string;
  tags: string[];
  location: TransactionLocation;
  riskScore: number;
}