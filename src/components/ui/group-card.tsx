import { SurfaceCard } from "@/components/ui/surface-card";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

export type GroupStatus = "forming" | "active" | "completed";

interface GroupCardProps {
  name: string;
  potAmount: string;
  contribution: string;
  position: number;
  total: number;
  status: GroupStatus;
  isMyMonth?: boolean;
}

const STATUS_LABEL: Record<GroupStatus, string> = {
  forming: "An fòmasyon",
  active: "Aktif",
  completed: "Konplete",
};

const STATUS_VARIANT: Record<GroupStatus, "wait" | "paid" | "secondary"> = {
  forming: "wait",
  active: "paid",
  completed: "secondary",
};

export function GroupCard({
  name,
  potAmount,
  contribution,
  position,
  total,
  status,
  isMyMonth = false,
}: GroupCardProps) {
  return (
    <SurfaceCard
      className={cn(
        "flex w-full flex-col gap-4 text-left",
        isMyMonth && "ring-2 ring-soley"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[1.05rem] font-bold text-ink">{name}</span>
        <Chip variant={STATUS_VARIANT[status]} className="h-7 px-3 text-xs">
          {STATUS_LABEL[status]}
        </Chip>
      </div>

      <p className="text-[2rem] leading-none font-bold text-ink">{potAmount}</p>

      <div className="flex items-center justify-between text-[0.9rem] text-ink-secondary">
        <span>{contribution} / mwa</span>
        <span>
          Pozisyon {position} sou {total}
        </span>
      </div>

      {isMyMonth && (
        <span className="rounded-full bg-soley/15 px-3 py-1.5 text-center text-[0.85rem] font-bold text-ink">
          Se mwa pa w — ou resevwa pot la
        </span>
      )}
    </SurfaceCard>
  );
}
