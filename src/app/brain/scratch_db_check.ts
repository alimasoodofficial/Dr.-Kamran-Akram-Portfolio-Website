import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { getSupabaseService } from "../../lib/supabaseService";

async function main() {
  try {
    const supabase = getSupabaseService();

    const { data: ebooks, error: ebError } = await supabase
      .from("ebooks")
      .select("*");
    console.log("Ebooks:", JSON.stringify(ebooks, null, 2));

    const { data: txs, error: txError } = await supabase
      .from("transactions")
      .select("*");
    console.log("Transactions:", JSON.stringify(txs, null, 2));

    const { data: profiles, error: prError } = await supabase
      .from("profiles")
      .select("*");
    console.log("Profiles:", JSON.stringify(profiles, null, 2));
  } catch (err) {
    console.error("Execution error:", err);
  }
}

main();
