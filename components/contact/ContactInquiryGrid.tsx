"use client";

import { useEffect, useState } from "react";

import { ContactCandidateForm } from "@/components/contact/ContactCandidateForm";
import { ContactCompanyForm } from "@/components/contact/ContactCompanyForm";
import { themeTokens } from "@/lib/theme/tokens";

export function ContactInquiryGrid() {
  const { colors } = themeTokens;
  const [activeInquiry, setActiveInquiry] = useState<"company" | "candidate">("company");

  useEffect(() => {
    const updateActiveInquiry = () => {
      setActiveInquiry(window.location.hash === "#candidate-inquiry" ? "candidate" : "company");
    };

    updateActiveInquiry();
    window.addEventListener("hashchange", updateActiveInquiry);

    return () => {
      window.removeEventListener("hashchange", updateActiveInquiry);
    };
  }, []);

  return (
    <section style={{ backgroundColor: colors.surfaceAlt }} className="pb-6 pt-0 sm:pb-8">
      <div className="site-container">
        <div className="grid gap-6 xl:grid-cols-2">
          <ContactCompanyForm isActive={activeInquiry === "company"} />
          <ContactCandidateForm isActive={activeInquiry === "candidate"} />
        </div>
      </div>
    </section>
  );
}

