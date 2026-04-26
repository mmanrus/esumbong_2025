import BookDemo from "@/components/atoangUI/book-demo";
import CitizenFeedback from "@/components/atoangUI/citizen-feedback";
import CommunityImpact from "@/components/atoangUI/community-impact";
import CTA from "@/components/atoangUI/cta";
import Header from "@/components/atoangUI/headers";
import TransparencyDashboard from "@/components/atoangUI/transparency-dashboard";
import FeaturesShowcase from "@/components/FeatureShowcase";

export const metadata = {
  title: "E-Sumbong - Your Voice, Our Action",
  description:
    "Report community issues, track progress, and engage with your local government through e-Sumbong platform.",
};

export default function Page() {
  return (
    <main>
      <Header />
      <TransparencyDashboard />
      <CommunityImpact />
      <CitizenFeedback />
      <FeaturesShowcase/>
      <BookDemo/>
      <CTA />
    </main>
  );
}
