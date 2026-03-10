import { CreativePricing } from "@/components/ui/creative-pricing";
import type { PricingTier } from "@/components/ui/creative-pricing";
import { Button } from "@/components/ui/Button2";
import { Check, Clock, Users, Award, Zap } from "lucide-react";

const consultationTiers: PricingTier[] = [
  {
    name: "Quick Chat",
    icon: <Zap className="w-6 h-6" />,
    price: 0,
    description: "For: Quick intro or fast question",
    color: "yellow",
    features: [
      "5-minute call",
      "Introduction and quick Q&A",
      "No commitment required",
    ],
  },
  {
    name: "Quick-Fire Session",
    icon: <Clock className="w-6 h-6" />,
    price: 60,
    description: "For: Students or professionals",
    color: "green",
    features: [
      "30-minute video/phone call",
      "Review of one document (CV or proposal)",
      "Quick Q&A and actionable advice",
      "Summary email after the session",
    ],
  },
  {
    name: "Deep-Dive Consultation",
    icon: <Award className="w-6 h-6" />,
    price: 110,
    description: "For: Key applications or career moves",
    color: "blue",
    features: [
      "60-minute detailed call",
      "Review of up to two documents",
      "Discussion on goals, challenges, and next steps",
      "Follow-up email with personalised action checklist",
    ],
    popular: true,
  },
  {
    name: "Mentorship Package",
    icon: <Users className="w-6 h-6" />,
    price: 450,
    description: "For: Master's/PhD & early-career professionals",
    color: "purple",
    features: [
      "Five 1-hour sessions (over 4–5 weeks)",
      "Review of up to three documents (CV, proposal, LinkedIn)",
      "Ongoing Q&A by email between sessions",
      "Final roadmap + checklist to guide you forward",
    ],
  },
];

function PricingPlanDemo() {
  return (
    <CreativePricing
      tag="🎯 Consultation Packages"
      title="Choose Your Consultation Package"
      description="Pick the support level that fits your time and budget"
      tiers={consultationTiers}
    />
  );
}

export { PricingPlanDemo };
