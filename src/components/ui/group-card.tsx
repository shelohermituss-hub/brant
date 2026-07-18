import { FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PillButton } from "@/components/ui/pill-button";

interface GroupCardProps {
  potAmount: string;
  contribution: string;
  memberCount: number;
  yourPosition: number;
  startDate: string;
  endDate: string;
  adminFees: string;
  joined: boolean;
  requested?: boolean;
  onJoin?: () => void;
}

export function GroupCard({
  potAmount,
  contribution,
  memberCount,
  yourPosition,
  startDate,
  endDate,
  adminFees,
  joined,
  requested = false,
  onJoin,
}: GroupCardProps) {
  const tooltipLeft = ((yourPosition - 0.5) / memberCount) * 100;

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-surface p-5 text-left">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[1.6rem] leading-none font-bold text-ink">{potAmount}</p>
        {joined ? (
          <span className="pt-1 text-[0.95rem] font-bold text-green">Konfime</span>
        ) : requested ? (
          <span className="pt-1 text-[0.95rem] font-bold text-wait">An atant apwobasyon</span>
        ) : (
          <PillButton
            variant="primary"
            onClick={onJoin}
            className="h-9 shrink-0 gap-1 px-4 text-[0.85rem]"
          >
            <Plus size={14} strokeWidth={3} /> Mande antre
          </PillButton>
        )}
      </div>

      <p className="text-[0.95rem]">
        <span className="font-bold text-green">{contribution}</span>
        <span className="text-ink-secondary"> / mwa</span>
      </p>

      <div className="relative rounded-md border border-dashed border-border-strong px-4 pt-8 pb-3">
        <div
          className="absolute top-2 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${tooltipLeft}%` }}
        >
          <span className="rounded-md bg-green px-2 py-1 text-xs font-bold whitespace-nowrap text-white">
            Tou pa w
          </span>
          <span className="h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-green" />
        </div>

        <div className="flex gap-1">
          {Array.from({ length: memberCount }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i + 1 === yourPosition ? "bg-green" : "bg-border-strong"
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 text-[0.85rem]">
          <span className="text-ink-secondary">{startDate}</span>
          <span className="font-bold text-ink">{memberCount} Manm</span>
          <span className="text-ink-secondary">{endDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[0.85rem] text-ink-secondary">
        <FileText size={16} />
        Frè administratif : <span className="font-bold text-ink">{adminFees}</span>
      </div>
    </div>
  );
}
