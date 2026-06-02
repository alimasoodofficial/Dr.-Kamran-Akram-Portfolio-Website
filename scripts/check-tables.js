const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  console.log("Listing tables or views...");
  
  // Try querying a generic table to see what works
  const tables = ["bookings", "ebooks", "promo_codes", "profiles", "newsletters", "newsletter_subscribers"];
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) {
      console.log(`Table ${table} does NOT exist or error:`, error.message);
    } else {
      console.log(`Table ${table} EXISTS, count =`, count);
    }
  }
}

run();
