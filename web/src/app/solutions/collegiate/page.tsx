import { SOLUTIONS } from "@/lib/solutions-content";
import { SolutionsPageContent } from "@/components/solutions/solutions-page-content";

export const metadata = {
  title: "Collegiate Esports — Maxime",
  description:
    "Recruit campus players, manage rosters, and discover sponsors for your collegiate esports organization.",
};

export default function CollegiateSolutionsPage() {
  return <SolutionsPageContent content={SOLUTIONS.collegiate} />;
}
