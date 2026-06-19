const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

const DEFAULT_CARDS = [
  {
    id: "card_1",
    card_type: "info",
    category: "Ph.D",
    title: "Animal Sciences||Bridging livestock research, innovation and real world agricultural impact.",
    bg_color: "bento-card-green",
    button_text: "View Publications",
    button_link: "/free-resources/articles",
  },
  {
    id: "card_2",
    card_type: "strip",
    category: "",
    title: "Science Communicator||Making science, agriculture and innovation easier to understand and share.",
    bg_color: "bento-card-emerald",
    button_text: "Play a Game",
    button_link: "#",
  },
  {
    id: "specialization",
    card_type: "image",
    category: "Specialization",
    title: "Building Meaningful Ideas Across Science, Agriculture & Innovation",
    image_url: "https://images.unsplash.com/photo-1710322928695-c7fb49886cb1",
    bg_color: "bento-card-green",
    button_text: "",
    button_link: "",
  },
  {
    id: "card_4",
    card_type: "stat",
    category: "Years of Experience",
    title: "10+",
    bg_color: "bento-card-dark",
    button_text: "Hire for Consulting",
    button_link: "/consulting",
  },
  {
    id: "card_5",
    card_type: "image",
    category: "Research",
    title: "Microbiology Research on Bioplastic Producing Bacteria (PHAs), and PhD Research in Parasitology, Buffalo Fly, Cattle Phenotyping, Proteomics & Genomics.",
    image_url: "https://images.unsplash.com/photo-1587355760421-b9de3226a046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0MDZ8MHwxfHNlYXJjaHwyMnx8cmVzZWFyY2h8ZW58MHx8fHwxNzY3Mjk4OTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    bg_color: "rgba(1, 28, 22, 0.75) 0%, rgba(5, 150, 105, 0.5) 100%",
    button_text: "",
    button_link: "/free-resources/articles",
  },
  {
    id: "card_6",
    card_type: "info",
    category: "",
    title: "eBooks||Explore free and premium eBooks covering science, agriculture, innovation, research and practical insights.",
    bg_color: "bento-card-teal",
    button_text: "Browse eBooks",
    button_link: "/ebooks",
  },
  {
    id: "card_7",
    card_type: "strip",
    category: "",
    title: "MLA Red Meat Industry Ambassador||",
    bg_color: "bento-card-emerald",
    button_text: "",
    button_link: "",
  }
];

async function run() {
  console.log("Seeding hero_settings...");

  for (const card of DEFAULT_CARDS) {
    // Check if the card already exists
    const { data: existing, error: checkError } = await supabase
      .from("hero_settings")
      .select("id")
      .eq("id", card.id)
      .maybeSingle();

    if (checkError) {
      console.error(`Error checking card ${card.id}:`, checkError.message);
      continue;
    }

    if (!existing) {
      console.log(`Inserting default settings for ${card.id}...`);
      const { error: insertError } = await supabase
        .from("hero_settings")
        .insert([card]);
      if (insertError) {
        console.error(`Error inserting card ${card.id}:`, insertError.message);
      } else {
        console.log(`Card ${card.id} inserted successfully.`);
      }
    } else {
      console.log(`Card ${card.id} already exists, skipping seed.`);
    }
  }
  console.log("Seeding finished.");
}

run();
