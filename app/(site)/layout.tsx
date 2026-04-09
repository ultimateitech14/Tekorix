import { Footer } from "@/components/global/Footer";
import { Navbar } from "@/components/global/Navbar";
import { PublicExitIntentDialog } from "@/components/global/PublicExitIntentDialog";
import { StickyLeadForm } from "@/components/global/StickyLeadForm";
import { WhatsAppFAB } from "@/components/global/WhatsAppFAB";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#CFE3FF] text-slate-900">
      <Navbar />
      <main className="flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-20 sm:pb-[calc(7rem+env(safe-area-inset-bottom))] xl:pb-10">
        {children}
      </main>
      <Footer />
      <StickyLeadForm />
      <WhatsAppFAB />
      <PublicExitIntentDialog />
    </div>
  );
}
