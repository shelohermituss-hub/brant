import Image from "next/image";
import { ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { PillButton } from "@/components/ui/pill-button";
import { Sparkline } from "@/components/ui/sparkline";
import { SavingsIcon } from "@/components/ui/savings-icon";

interface HomeScreenProps {
  variant?: "empty" | "populated";
}

function CardTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[1.05rem] font-bold text-ink">{label}</span>
      <ChevronRight size={18} className="text-ink-secondary" />
    </div>
  );
}

export function HomeScreen({ variant = "populated" }: HomeScreenProps) {
  const populated = variant === "populated";

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pt-4 pb-6">
      <header className="flex items-center justify-between px-1 pb-1">
        <h1 className="text-[2.1rem] font-bold text-ink">Money</h1>
        <div className="h-11 w-11 shrink-0 rounded-full bg-ink-secondary/30" />
      </header>

      <SurfaceCard className="flex flex-col gap-7">
        <div className="flex items-start justify-between">
          <span className="text-lg font-bold text-ink">Cash Balance</span>
          <span className="flex items-center gap-0.5 text-sm text-ink-secondary">
            Account &amp; Routing
            <ChevronRight size={16} />
          </span>
        </div>
        <p className="text-[2.75rem] leading-none font-bold text-ink">
          {populated ? "$88.44" : "$0.00"}
        </p>
        <div className="flex gap-3">
          <PillButton
            variant="secondary"
            href="/add-cash"
            className="h-12 flex-1 text-[0.95rem]"
          >
            Add Cash
          </PillButton>
          <PillButton variant="secondary" className="h-12 flex-1 text-[0.95rem]">
            Cash Out
          </PillButton>
        </div>
      </SurfaceCard>

      <div className="grid grid-cols-2 gap-3">
        <SurfaceCard className="flex flex-col gap-4">
          <CardTitle label="Savings" />
          <SavingsIcon />
          <div>
            <p className="text-xl font-bold text-ink">$0.00</p>
            <p className="text-sm text-ink-secondary">Save for a goal</p>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col gap-4">
          <CardTitle label={populated ? "Bitcoin" : "Buy bitcoin"} />
          {populated ? (
            <>
              <Sparkline
                color="var(--color-cyan)"
                path="M2,28 L14,26 L26,27 L38,18 L50,20 L62,10 L74,13 L86,4 L98,7"
              />
              <div>
                <p className="text-xl font-bold text-ink">$92.05</p>
                <p className="flex items-center gap-1 text-sm text-ink-secondary">
                  <ArrowUp size={12} />
                  0.50% today
                </p>
              </div>
            </>
          ) : (
            <div className="relative -mx-1 -mb-1 aspect-square overflow-hidden rounded-md">
              <Image
                src="/images/illustration-bitcoin.png"
                alt="Buy bitcoin"
                fill
                className="object-cover"
              />
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard className="flex flex-col gap-4">
          <CardTitle label={populated ? "Stocks" : "Invest in stocks"} />
          {populated ? (
            <>
              <Sparkline
                color="var(--color-purple)"
                path="M2,6 L10,10 L18,28 L26,24 L34,14 L42,18 L50,26 L58,20 L66,24 L74,17 L82,22 L90,18 L98,21"
              />
              <div>
                <p className="text-xl font-bold text-ink">$2,995.85</p>
                <p className="flex items-center gap-1 text-sm text-ink-secondary">
                  <ArrowDown size={12} />
                  0.80% today
                </p>
              </div>
            </>
          ) : (
            <div className="relative -mx-1 -mb-1 aspect-square overflow-hidden rounded-md">
              <Image
                src="/images/illustration-stocks.png"
                alt="Invest in stocks"
                fill
                className="object-cover"
              />
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard className="flex flex-col gap-4">
          <CardTitle label="Free tax filing" />
          <div className="relative -mx-1 -mb-1 aspect-square overflow-hidden rounded-md">
            <Image
              src="/images/illustration-tax-filing.png"
              alt="Free tax filing"
              fill
              className="object-cover"
            />
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
