/**
 * User Identities & Permissions
 */
export type UserRole = "admin" | "farmer" | "exporter";

export type ProfileRow = {
  id: string;
  role: UserRole;
  full_name: string | null;
};

/**
 * Agricultural Business Entities
 */
export type FarmerRow = {
  id: string;
  user_id: string;
  fullName: string;
  phone: string;
  location: string;
  status: "Pending" | "Verified" | "Rejected";
  created_at: string;
};

export type ProductRow = {
  id: string;
  farmer_user_id: string;
  crop_type: string;
  description: string | null;
  quantity: number; // In Quintals (QNTL)
  location: string; // <--- ADDED THIS LINE
  price_per_unit: number;
  image_url: string | null;
  status: string; // e.g., "available", "sold"
  created_at: string;
};

/**
 * Transactional & Contract Logic
 */
export type DealRow = {
  id: string;
  farmer_user_id: string;
  exporter_user_id: string;
  crop_type: string;
  price_per_unit: number;
  estimated_quantity: number;
  estimated_value: number; // price * quantity
  status: "Active" | "Confirmed" | "Disputed";
  created_at: string;
};

/**
 * Financial & Ledger Management
 */
export type PaymentRow = {
  id: string;
  deal_id: string;
  payer_user_id: string;
  payee_user_id: string;
  gross_amount: number;
  commission_rate: number; // e.g., 0.05 for 5%
  commission_value: number;
  payout_amount: number; // gross - commission
  status: "Pending" | "Partial" | "Completed";
  created_at: string;
};