import { supabase } from "./src/lib/supabase/client.js";

async function seedData() {
  // Create sample users
  const { data: user1, error: user1Error } = await supabase.auth.signUp({
    email: "farmer1@example.com",
    password: "password123",
  });
  if (user1Error) console.error(user1Error);

  const { data: user2, error: user2Error } = await supabase.auth.signUp({
    email: "exporter1@example.com",
    password: "password123",
  });
  if (user2Error) console.error(user2Error);

  // Assume we set roles manually or via trigger

  // Insert profiles
  await supabase.from("profiles").insert([
    { id: user1.user?.id, role: "farmer", full_name: "Farmer One" },
    { id: user2.user?.id, role: "exporter", full_name: "Exporter One" },
  ]);

  // Insert farmer data
  await supabase.from("farmers").insert({
    user_id: user1.user?.id,
    full_name: "Farmer One",
    phone: "123456789",
    location: "Oromia",
    status: "Verified",
  });

  // Insert exporter data
  await supabase.from("exporters").insert({
    user_id: user2.user?.id,
    company_name: "Export Co",
    phone: "987654321",
    license_id: "LIC123",
    status: "Verified",
  });

  // Insert products
  await supabase.from("products").insert({
    farmer_user_id: user1.user?.id,
    crop_type: "Teff",
    description: "High quality teff from highlands",
    quantity: 100,
    price_per_unit: 500,
    status: "Available",
  });

  console.log("Seeded data");
}

seedData();