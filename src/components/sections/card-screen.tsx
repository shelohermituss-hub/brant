import Link from "next/link";
import { GroupCard } from "@/components/ui/group-card";
import { PillButton } from "@/components/ui/pill-button";
import { MiniWonnIcon } from "@/components/ui/mini-wonn-icon";

interface CardScreenProps {
  variant?: "empty" | "populated";
}

const GROUPS = [
  {
    id: "fanmi",
    href: "/group",
    name: "Sòl Fanmi",
    potAmount: "50 000 HTG",
    contribution: "5 000 HTG",
    position: 6,
    total: 10,
    status: "active" as const,
    isMyMonth: false,
  },
  {
    id: "kominote",
    href: "/group",
    name: "Sòl Kominote",
    potAmount: "20 000 HTG",
    contribution: "2 000 HTG",
    position: 3,
    total: 10,
    status: "active" as const,
    isMyMonth: true,
  },
  {
    id: "vwazinaj",
    href: "/group/forming",
    name: "Sòl Vwazinaj",
    potAmount: "30 000 HTG",
    contribution: "3 000 HTG",
    position: 5,
    total: 10,
    status: "forming" as const,
    isMyMonth: false,
  },
];

export function CardScreen({ variant = "populated" }: CardScreenProps) {
  const populated = variant === "populated";

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-surface-muted px-4 pt-4 pb-6">
      <header className="flex items-center justify-between px-1 pb-1">
        <h1 className="text-[2.1rem] font-bold text-ink">Sik mwen yo</h1>
        <Link
          href="/account"
          className="h-11 w-11 shrink-0 rounded-full bg-ink-secondary/30"
        />
      </header>

      {populated ? (
        <div className="flex flex-col gap-3">
          {GROUPS.map(({ href, ...group }) => (
            <Link key={group.id} href={href}>
              <GroupCard {...group} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <MiniWonnIcon />
          <div className="flex flex-col gap-1 px-6">
            <p className="text-[1.1rem] font-bold text-ink">Ou pa gen sòl pou kounye a</p>
            <p className="text-[0.95rem] text-ink-secondary">
              Kreye yon sòl oswa tann yon envitasyon pou w antre nan youn.
            </p>
          </div>
          <PillButton href="/group/create/amount" className="h-12 px-8 text-[0.95rem]">
            Kreye yon sòl
          </PillButton>
          <Link href="/group/invite" className="text-[0.9rem] font-bold text-green">
            Gen yon envitasyon? Wè li
          </Link>
        </div>
      )}
    </div>
  );
}
