"use client";

const STORAGE_KEY = "solid_onboarding_draft";

interface OnboardingDraft {
  email?: string;
  fullName?: string;
  phone?: string;
}

export function readOnboardingDraft(): OnboardingDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OnboardingDraft) : {};
  } catch {
    return {};
  }
}

export function writeOnboardingDraft(patch: Partial<OnboardingDraft>) {
  if (typeof window === "undefined") return;
  const current = readOnboardingDraft();
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
}

export function clearOnboardingDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
