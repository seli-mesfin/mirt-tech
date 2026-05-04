import { supabase } from "@/lib/supabase/client";
import type {
  DealRow,
  FarmerRow,
  PaymentRow,
  ProductRow,
  ProfileRow,
} from "@/lib/auth/types";

/* -----------------------------
   🔥 SAFE ERROR HANDLER
------------------------------*/
function normalizeSupabaseError(err: unknown, fallback: string): never {
  console.error("🔥 FULL SUPABASE ERROR OBJECT:");
  console.dir(err, { depth: null });

  const maybeError = err as { message?: unknown };
  const message =
    typeof err === "object" && err !== null && typeof maybeError.message === "string"
      ? maybeError.message
      : fallback;

  throw new Error(message);
}

/* -----------------------------
   🧱 DEAL MAPPER
------------------------------*/
function mapDealRows(data: unknown[] = []): DealRow[] {
  return data.map((item) => {
    const record = item as Record<string, unknown>;
    const rawStatus = record.status;
    const status =
      rawStatus === "Active" || rawStatus === "Confirmed" || rawStatus === "Disputed"
        ? rawStatus
        : "Active";

    return {
      id: String(record.id ?? ""),
      farmer_user_id: String(record.farmer_user_id ?? ""),
      exporter_user_id: String(record.exporter_user_id ?? ""),
      crop_type: String(record.crop_type ?? ""),
      price_per_unit: Number(record.price_per_unit ?? 0),
      estimated_quantity: Number(record.estimated_quantity ?? 0),
      estimated_value: Number(record.estimated_value ?? 0),
      status,
      created_at: String(record.created_at ?? ""),
    };
  });
}

/* -----------------------------
   👤 PROFILES & ROLES
------------------------------*/
export async function fetchProfiles() {
  if (!supabase) throw new Error("Supabase client not configured.");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) normalizeSupabaseError(error, "Unable to load profiles");
  return (data ?? []) as ProfileRow[];
}

/* -----------------------------
   🌾 FARMER OPERATIONS
------------------------------*/
export async function fetchFarmersByUser(userId: string) {
  if (!supabase || !userId) return [];

  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) normalizeSupabaseError(error, "Unable to load farmer record");
  return (data ?? []) as FarmerRow[];
}

/* -----------------------------
   🤝 DEAL & CONTRACT TRACKING
------------------------------*/
export async function createDeal(deal: Omit<DealRow, "id" | "created_at">) {
  if (!supabase) throw new Error("Supabase client not configured.");

  const { data, error } = await supabase
    .from("deals")
    .insert(deal)
    .select()
    .single();

  if (error) normalizeSupabaseError(error, "Failed to initiate sourcing deal");
  return data as DealRow;
}

export async function fetchDealsForExporter(exporterId: string) {
  if (!supabase || !exporterId) return [];

  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("exporter_user_id", exporterId)
    .order("created_at", { ascending: false });

  if (error) normalizeSupabaseError(error, "Unable to load deals");
  return mapDealRows(data ?? []);
}

/* -----------------------------
   🛒 PRODUCT & INVENTORY (CHECKED)
------------------------------*/

export async function fetchAllProducts() {
  if (!supabase) throw new Error("Supabase client not configured.");

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) normalizeSupabaseError(error, "Unable to load marketplace products");

  // CRITICAL FIX: Mapping database 'title' and 'user_id' to UI 'crop_type' and 'farmer_user_id'
  return (data ?? []).map((post: any) => ({
    ...post,
    crop_type: post.title,        // Database has 'title'
    farmer_user_id: post.user_id, // Database has 'user_id'
    price_per_unit: 4500          // Fallback value for testing
  })) as ProductRow[];
}

export async function createProduct(product: Omit<ProductRow, "id" | "created_at">) {
  if (!supabase) throw new Error("Supabase client not configured.");

  // CRITICAL FIX: Sending data using the column names your DB actually has
  const payload = {
    user_id: product.farmer_user_id,
    title: product.crop_type,
    quantity: product.quantity,
    location: product.location,
    description: product.description || ""
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error) normalizeSupabaseError(error, "Unable to list product");
  return data as ProductRow;
}

export async function fetchProductsByFarmer(farmerId: string) {
  if (!supabase || !farmerId) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", farmerId) // Database uses 'user_id'
    .order("created_at", { ascending: false });

  if (error) normalizeSupabaseError(error, "Unable to load products");

  return (data ?? []).map((post: any) => ({
    ...post,
    crop_type: post.title,
    farmer_user_id: post.user_id
  })) as ProductRow[];
}
/* -----------------------------
    🛠️ MISSING ADMIN OPERATIONS
------------------------------*/

// 1. Fetch ALL Deals for the Admin Dashboard
export async function fetchAllDeals() {
  if (!supabase) throw new Error("Supabase client not configured.");

  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) normalizeSupabaseError(error, "Unable to load all deals");
  return mapDealRows(data ?? []);
}

// 2. Fetch ALL Farmers for the Admin Dashboard
export async function fetchAllFarmers() {
  if (!supabase) throw new Error("Supabase client not configured.");

  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) normalizeSupabaseError(error, "Unable to load all farmers");
  return (data ?? []) as FarmerRow[];
}

// 3. Fetch ALL Payments (Used by Admin and Exporter Reports)
export async function fetchAllPayments() {
  if (!supabase) throw new Error("Supabase client not configured.");

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) normalizeSupabaseError(error, "Unable to load payments");
  return (data ?? []) as PaymentRow[];
}

// 4. Fetch Payments specifically for an Exporter
export async function fetchPaymentsByPayer(exporterId: string) {
  if (!supabase || !exporterId) return [];

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("payer_id", exporterId)
    .order("created_at", { ascending: false });

  if (error) normalizeSupabaseError(error, "Unable to load your payments");
  return (data ?? []) as PaymentRow[];
}