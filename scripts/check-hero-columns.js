const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  console.log("Checking hero_settings table...");
  const { data, error } = await supabase.from("hero_settings").select("*");
  if (error) {
    console.error("Error fetching hero_settings:", error);
  } else {
    console.log("hero_settings records:", data);
  }
}

run();
