import { requestApi } from "@/lib/api/http";
import type { CompanyLeadValues } from "@/lib/validators/company-lead";

export type CompanyLeadSourcePage = "contact" | "find-talent";

export type SubmitCompanyLeadPayload = CompanyLeadValues & {
  sourcePage: CompanyLeadSourcePage;
};

export async function submitCompanyLead(payload: SubmitCompanyLeadPayload) {
  return requestApi<unknown, SubmitCompanyLeadPayload>("/api/v1/company-leads", {
    method: "POST",
    body: payload,
  });
}
