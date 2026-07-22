export type MerchantTier = "bronze" | "silver" | "gold";

interface MerchantTierInfo {
  label: string;
  walletCeiling: number;
  collectionFeeRate: number;
  bankAccount: "Non" | "Opsyonèl" | "Obligatwa";
}

/** Source : .claude/skills/moncash-flow/SKILL.md — barème réel MonCash par palier marchand. */
export const MERCHANT_TIERS: Record<MerchantTier, MerchantTierInfo> = {
  bronze: { label: "Bronze", walletCeiling: 100_000, collectionFeeRate: 0.005, bankAccount: "Non" },
  silver: { label: "Silver", walletCeiling: 2_000_000, collectionFeeRate: 0.02, bankAccount: "Opsyonèl" },
  gold: { label: "Gold", walletCeiling: 3_000_000, collectionFeeRate: 0.02, bankAccount: "Obligatwa" },
};

export function collectionFeeRateFor(tier: string | null): number {
  return tier === "bronze" || !tier
    ? MERCHANT_TIERS.bronze.collectionFeeRate
    : MERCHANT_TIERS.silver.collectionFeeRate;
}

export function merchantTierInfoFor(tier: string | null): MerchantTierInfo {
  return MERCHANT_TIERS[tier === "silver" || tier === "gold" ? tier : "bronze"];
}
