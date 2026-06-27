import { SOLUTIONS } from "@/lib/solutions-content";
import { SolutionsPageContent } from "@/components/solutions/solutions-page-content";

export const metadata = {
  title: "Grassroots Esports — Maxime",
  description:
    "Recruit regional players, manage community rosters, and run your grassroots esports org from one dashboard.",
};

export default function GrassrootsSolutionsPage() {
  return <SolutionsPageContent content={SOLUTIONS.grassroots} />;
}
