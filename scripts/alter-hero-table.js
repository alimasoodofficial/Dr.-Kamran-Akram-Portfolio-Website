const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  console.log("Altering hero_settings table...");
  
  const sqlCommands = [
    "ALTER TABLE hero_settings ADD COLUMN IF NOT EXISTS subtitle VARCHAR(255) DEFAULT '';",
    "ALTER TABLE hero_settings ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';"
  ];

  for (const sql of sqlCommands) {
    let success = false;
    try {
      const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql });
      if (error) {
        console.log(`exec_sql RPC failed for query: "${sql}" - error:`, error.message);
      } else {
        console.log(`exec_sql RPC succeeded for query: "${sql}"`, data);
        success = true;
      }
    } catch (e) {
      console.log(`exec_sql RPC throw error for query: "${sql}" - error:`, e.message);
    }

    if (!success) {
      try {
        const { data, error } = await supabase.rpc("execute_sql", { query: sql });
        if (error) {
          console.log(`execute_sql RPC failed for query: "${sql}" - error:`, error.message);
        } else {
          console.log(`execute_sql RPC succeeded for query: "${sql}"`, data);
          success = true;
        }
      } catch (e) {
        console.log(`execute_sql RPC throw error for query: "${sql}" - error:`, e.message);
      }
    }
  }

  // Verify the columns
  const { data, error } = await supabase.from("hero_settings").select("*").limit(1);
  if (error) {
    console.error("Verification failed:", error);
  } else {
    console.log("Verification sample record:", data[0]);
  }
}

run();
