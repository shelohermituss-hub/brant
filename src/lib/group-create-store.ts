"use client";

const STORAGE_KEY = "solid_group_create_draft";

export type Frequency = "mwa" | "2-semenn" | "3-jou";

interface GroupCreateDraft {
  name?: string;
  potAmount?: number;
  durationMonths?: number;
  frequency?: Frequency;
  installmentsPerMonth?: number;
  invitedUserIds?: string[];
}

export function readGroupCreateDraft(): GroupCreateDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GroupCreateDraft) : {};
  } catch {
    return {};
  }
}

export function writeGroupCreateDraft(patch: Partial<GroupCreateDraft>) {
  if (typeof window === "undefined") return;
  const current = readGroupCreateDraft();
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
}

export function clearGroupCreateDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
