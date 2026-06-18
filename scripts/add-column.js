const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  console.log("Trying to alter table ebooks to add page_count...");
  
  // Try using an RPC function if it exists (e.g. exec_sql or execute_sql)
  try {
    const { data, error } = await supabase.rpc("exec_sql", { 
      sql_query: "ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 0;" 
    });
    if (error) {
      console.log("exec_sql RPC failed or not found:", error.message);
    } else {
      console.log("ALTER TABLE succeeded via exec_sql RPC!", data);
      return;
    }
  } catch (e) {
    console.log("exec_sql RPC call error:", e.message);
  }

  try {
    const { data, error } = await supabase.rpc("execute_sql", { 
      query: "ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 0;" 
    });
    if (error) {
      console.log("execute_sql RPC failed or not found:", error.message);
    } else {
      console.log("ALTER TABLE succeeded via execute_sql RPC!", data);
      return;
    }
  } catch (e) {
    console.log("execute_sql RPC call error:", e.message);
  }

  console.log("No built-in RPC for executing SQL. Since the table schema migration needs to be executed, we will query existing records to see if the column exists.");
  const { data, error } = await supabase.from("ebooks").select("page_count").limit(1);
  if (error) {
    console.log("page_count column does NOT exist in the database. Please run the SQL in your Supabase SQL Editor:", error.message);
  } else {
    console.log("page_count column already exists in the database!", data);
  }
}

run();
