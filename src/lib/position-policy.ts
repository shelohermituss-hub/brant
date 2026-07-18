export interface PositionPolicy {
  min_score_for_any_position: number;
  min_score_for_20th_percentile: number;
  min_score_for_50th_percentile: number;
}

/** Reflète côté client la logique de public.assign_position() — pour preview/affichage uniquement, jamais pour écrire une position réelle. */
export function minPositionFor(score: number, totalMembers: number, policy: PositionPolicy) {
  if (score >= policy.min_score_for_any_position) return 1;
  if (score >= policy.min_score_for_20th_percentile) return Math.max(1, Math.ceil(totalMembers * 0.2));
  if (score >= policy.min_score_for_50th_percentile) return Math.max(1, Math.ceil(totalMembers * 0.5));
  return Math.max(1, Math.floor(totalMembers * 0.8) + 1);
}
