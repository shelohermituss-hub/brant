import { FileText, Plus } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { TrainTrack, type TrainStation } from "@/components/ui/train-track";

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
  yourAvatarUrl?: string | null;
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
  yourAvatarUrl,
  onJoin,
}: GroupCardProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-surface p-5 text-left">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[1.6rem] leading-none font-bold text-ink">{potAmount}</p>
        {joined ? (
          <span className="pt-1 text-[0.95rem] font-bold text-green-deep">Konfime</span>
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
        <span className="font-bold text-green-deep">{contribution}</span>
        <span className="text-ink-secondary"> / mwa</span>
      </p>

      <div className="relative rounded-md border border-dashed border-border-strong px-4 pt-8 pb-3">
        <TrainTrack
          variant="compact"
          nowTooltip="Tou pa w"
          stations={Array.from(
            { length: memberCount },
            (_, i): TrainStation => ({
              position: i + 1,
              status: i + 1 === yourPosition ? "now" : "todo",
              avatarUrl: i + 1 === yourPosition ? yourAvatarUrl : null,
            })
          )}
        />

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
