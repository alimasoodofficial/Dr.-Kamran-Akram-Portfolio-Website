import { getSupabaseService } from "./src/lib/supabaseService.js";

async function main() {
  const supabase = getSupabaseService();
  const { data: ebooks, error } = await supabase
    .from("ebooks")
    .select("id, title, price, discount_price, discount_expires_at");

  if (error) {
    console.error("Error fetching ebooks:", error);
    return;
  }

  console.log("Ebooks inside database:");
  console.log(JSON.stringify(ebooks, null, 2));

  const { data: purchases, error: pError } = await supabase
    .from("purchases")
    .select("*");

  if (pError) {
    console.error("Error fetching purchases:", pError);
  } else {
    console.log("Purchases inside database:");
    console.log(JSON.stringify(purchases, null, 2));
  }
}

main();
