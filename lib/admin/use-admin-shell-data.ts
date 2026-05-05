"use client";

import { useEffect, useState } from "react";

import { getAdminSiteSettings } from "@/lib/api/admin/site-settings";
import { getAdminMe } from "@/lib/auth/client";

type AdminShellProfile = Awaited<ReturnType<typeof getAdminMe>>;

type AdminShellDataState = {
  profile: AdminShellProfile | null;
  companyName: string;
  companyEmail: string;
  isLoading: boolean;
};

const initialState: AdminShellDataState = {
  profile: null,
  companyName: "",
  companyEmail: "",
  isLoading: true,
};

export function useAdminShellData() {
  const [state, setState] = useState<AdminShellDataState>(initialState);

  useEffect(() => {
    let active = true;

    async function loadShellData() {
      const [profileResult, settingsResult] = await Promise.allSettled([getAdminMe(), getAdminSiteSettings()]);

      if (!active) {
        return;
      }

      setState({
        profile: profileResult.status === "fulfilled" ? profileResult.value : null,
        companyName:
          settingsResult.status === "fulfilled" ? settingsResult.value.companyName.trim() : "",
        companyEmail:
          settingsResult.status === "fulfilled" ? settingsResult.value.companyEmail.trim() : "",
        isLoading: false,
      });
    }

    void loadShellData();

    return () => {
      active = false;
    };
  }, []);

  return state;
}
