import { InfoCard, StripCard, ImageCard, CenterStatCard, SpecializationCard } from "./HeroCard";
import { getSupabaseService } from "@/lib/supabaseService";

// Helper to split subtitle and description from title column
function parseTitleAndDesc(titleVal: string | null | undefined, defaultTitle: string, defaultDesc: string) {
  if (!titleVal) return [defaultTitle, defaultDesc];
  const idx = titleVal.indexOf("||");
  if (idx === -1) return [titleVal, defaultDesc];
  return [titleVal.slice(0, idx), titleVal.slice(idx + 2)];
}

export default async function BentoGrid() {
  let cardsData: Record<string, any> = {};

  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from("hero_settings")
      .select("*");

    if (!error && data) {
      data.forEach((row) => {
        cardsData[row.id] = row;
      });
    }
  } catch (err) {
    console.error("Failed to fetch dynamic hero bento card settings:", err);
  }

  // --- Card 1: Info Card ---
  const c1Raw = cardsData["card_1"];
  const [c1Subtitle, c1Desc] = parseTitleAndDesc(
    c1Raw?.title,
    "",
    ""
  );
  const card1 = {
    title: c1Raw?.category !== undefined ? c1Raw.category : "",
    subtitle: c1Subtitle,
    desc: c1Desc,
    btnText: c1Raw?.button_text !== undefined ? c1Raw.button_text : "",
    bgClass: c1Raw?.bg_color || "bento-card-green",
    href: c1Raw?.button_link !== undefined ? c1Raw.button_link : "#",
    bgImage: c1Raw?.image_url || undefined,
  };

  // --- Card 2: Strip Card ---
  const c2Raw = cardsData["card_2"];
  const [c2Text, c2Desc] = parseTitleAndDesc(
    c2Raw?.title,
    "",
    ""
  );
  const card2 = {
    text: c2Text,
    desc: c2Desc,
    bgClass: c2Raw?.bg_color || "bento-card-emerald",
    buttonText: c2Raw?.button_text !== undefined ? c2Raw.button_text : "",
    buttonLink: c2Raw?.button_link !== undefined ? c2Raw.button_link : "#",
    bgImage: c2Raw?.image_url || undefined,
  };

  // --- Card 3: Specialization Card ---
  const c3Raw = cardsData["specialization"];
  const card3 = {
    cardType: c3Raw?.card_type || "image",
    category: c3Raw?.category !== undefined ? c3Raw.category : "",
    title: c3Raw?.title !== undefined ? c3Raw.title : "",
    bgImage: c3Raw?.image_url !== undefined ? c3Raw.image_url : "",
    bgColor: c3Raw?.bg_color || "bento-card-green",
    buttonText: c3Raw?.button_text || "",
    buttonLink: c3Raw?.button_link || "",
  };

  // --- Card 4: Center Stat Card ---
  const c4Raw = cardsData["card_4"];
  const card4 = {
    title: c4Raw?.title !== undefined ? c4Raw.title : "",
    subtitle: c4Raw?.category !== undefined ? c4Raw.category : "",
    buttonText: c4Raw?.button_text !== undefined ? c4Raw.button_text : "",
    buttonLink: c4Raw?.button_link !== undefined ? c4Raw.button_link : "#",
    bgClass: c4Raw?.bg_color || "bento-card-dark",
    bgImage: c4Raw?.image_url || undefined,
  };

  // --- Card 5: Research Image Card ---
  const c5Raw = cardsData["card_5"];
  const card5 = {
    category: c5Raw?.category !== undefined ? c5Raw.category : "",
    title: c5Raw?.title !== undefined ? c5Raw.title : "",
    bgImage: c5Raw?.image_url !== undefined ? c5Raw.image_url : "",
    bgClass: c5Raw?.bg_color || "bento-card-green",
    buttonText: c5Raw?.button_text || "",
    buttonLink: c5Raw?.button_link !== undefined ? c5Raw.button_link : "#",
  };

  // --- Card 6: eBooks Info Card ---
  const c6Raw = cardsData["card_6"];
  const [c6Subtitle, c6Desc] = parseTitleAndDesc(
    c6Raw?.title,
    "",
    ""
  );
  const card6 = {
    title: c6Raw?.category !== undefined ? c6Raw.category : "",
    subtitle: c6Subtitle,
    desc: c6Desc,
    btnText: c6Raw?.button_text !== undefined ? c6Raw.button_text : "",
    bgClass: c6Raw?.bg_color || "bento-card-teal",
    href: c6Raw?.button_link !== undefined ? c6Raw.button_link : "#",
    bgImage: c6Raw?.image_url || undefined,
  };

  // --- Card 7: MLA Ambassador Strip Card ---
  const c7Raw = cardsData["card_7"];
  const [c7Text, c7Desc] = parseTitleAndDesc(
    c7Raw?.title,
    "",
    ""
  );
  const card7 = {
    text: c7Text,
    desc: c7Desc,
    bgClass: c7Raw?.bg_color || "bento-card-emerald",
    buttonText: c7Raw?.button_text || "",
    buttonLink: c7Raw?.button_link || "",
    bgImage: c7Raw?.image_url || undefined,
  };

  return (
    <div className="w-full pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start animate-fadeInUp">
      {/* --- Column 1 --- */}
      <div className="flex flex-col gap-6">
        <InfoCard
          title={card1.title}
          subtitle={card1.subtitle}
          desc={card1.desc}
          btnText={card1.btnText}
          bgClass={card1.bgClass}
          href={card1.href}
          bgImage={card1.bgImage}
        />
        <StripCard
          text={card2.text}
          desc={card2.desc}
          bgClass={card2.bgClass}
          buttonText={card2.buttonText}
          buttonLink={card2.buttonLink}
          bgImage={card2.bgImage}
        />
      </div>

      {/* --- Column 2 --- */}
      <div className="flex flex-col gap-6 h-full">
        <SpecializationCard
          cardType={card3.cardType}
          category={card3.category}
          title={card3.title}
          bgImage={card3.bgImage}
          bgColor={card3.bgColor}
          buttonText={card3.buttonText}
          buttonLink={card3.buttonLink}
        />
      </div>

      {/* --- Column 3 --- */}
      <div className="flex flex-col gap-6">
        <CenterStatCard
          title={card4.title}
          subtitle={card4.subtitle}
          buttonText={card4.buttonText}
          buttonLink={card4.buttonLink}
          bgClass={card4.bgClass}
          bgImage={card4.bgImage}
        />
        <ImageCard
          category={card5.category}
          title={card5.title}
          bgImage={card5.bgImage}
          bgClass={card5.bgClass}
          buttonText={card5.buttonText}
          buttonLink={card5.buttonLink}
        />
      </div>

      {/* --- Column 4 --- */}
      <div className="flex flex-col gap-6">
        <InfoCard
          title={card6.title}
          subtitle={card6.subtitle}
          desc={card6.desc}
          btnText={card6.btnText}
          bgClass={card6.bgClass}
          href={card6.href}
          bgImage={card6.bgImage}
        />
        <StripCard
          text={card7.text}
          desc={card7.desc}
          bgClass={card7.bgClass}
          buttonText={card7.buttonText}
          buttonLink={card7.buttonLink}
          bgImage={card7.bgImage}
        />
      </div>
    </div>
  );
}
