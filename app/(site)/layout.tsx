import { Footer } from "@/components/global/Footer";
import { Navbar } from "@/components/global/Navbar";
import { PublicExitIntentDialog } from "@/components/global/PublicExitIntentDialog";
import { ScrollToTopFAB } from "@/components/global/ScrollToTopFAB";
import { StickyLeadForm } from "@/components/global/StickyLeadForm";
import { WhatsAppFAB } from "@/components/global/WhatsAppFAB";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="site-shell relative flex min-h-screen flex-col bg-[#E6F1FF] text-slate-900">
      <Navbar />
      <main className="type-body flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-20 sm:pb-[calc(7rem+env(safe-area-inset-bottom))] xl:pb-10">
        {children}
      </main>
      <Footer />
      <StickyLeadForm />
      <ScrollToTopFAB />
      <WhatsAppFAB />
      <PublicExitIntentDialog />
    </div>
  );
}
