import { Suspense } from "react";
import { ConfirmPinScreen } from "@/components/sections/confirm-pin-screen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ConfirmPinScreen />
    </Suspense>
  );
}
