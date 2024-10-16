"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

export default function InteractiveSheet({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <Sheet defaultOpen={true} open={true} onOpenChange={() => router.back()}>
      <SheetContent className="w-[400px] sm:w-[540px] md:w-[720px] lg:w-[920px]">
        {children}
      </SheetContent>
    </Sheet>
  );
}
