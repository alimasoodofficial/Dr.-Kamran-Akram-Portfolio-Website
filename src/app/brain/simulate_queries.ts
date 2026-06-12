import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { getSupabaseService } from "../../lib/supabaseService";

async function simulate() {
  const supabaseService = getSupabaseService();
  const ebookId = "88848673-1d82-4bb3-8aa9-bc6f1ef4d93a"; // GIS Mapping (not purchased)
  const stripeSessionId = "cs_test_a1VNnmCGYSOrwhlH0urgAAUY6Oif2YfY4D0RWGh3gC0NkfAqy01IQ1l9BI"; // Purchase for Genetic Mapping
  const email = "alimasood419@gmail.com";

  console.log("Simulating read-token checks for GIS Mapping (not purchased)...");

  // Query 1: stripeSessionId check
  const { data: purchase1, error: error1 } = await supabaseService
    .from("purchases")
    .select("*")
    .eq("ebook_id", ebookId)
    .eq("stripe_checkout_id", stripeSessionId)
    .maybeSingle();

  console.log("Stripe check purchase1:", purchase1, "Error:", error1);

  // Query 2: email check
  const { data: purchase2, error: error2 } = await supabaseService
    .from("purchases")
    .select("*")
    .eq("ebook_id", ebookId)
    .ilike("user_email", email.trim())
    .maybeSingle();

  console.log("Email check purchase2:", purchase2, "Error:", error2);
}

simulate();
