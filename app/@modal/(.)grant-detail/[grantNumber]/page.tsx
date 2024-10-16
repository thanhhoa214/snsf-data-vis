import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import GrantDetailSheetContent from "@/components/ui2/GrantDetailSheet";
import InteractiveSheet from "@/components/ui2/InteractiveSheet";
import { prisma } from "@/lib/prisma/client";
import { Suspense } from "react";

export default async function GrantDetailModal({
  params,
}: {
  params: { grantNumber: string };
}) {
  const grantNumber = parseInt(params.grantNumber, 10);
  const grant = await prisma.grant.findUnique({
    where: { GrantNumber: grantNumber },
    include: {
      GrantToPersonNetwork: { include: { Person1: true, Person2: true } },
    },
  });

  return (
    <InteractiveSheet>
      <SheetHeader>
        <SheetTitle>{grant?.Title}</SheetTitle>
        <SheetDescription>
          Detailed information about grant number {grantNumber}
        </SheetDescription>
      </SheetHeader>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="max-h-[80vh] overflow-auto">
          {grant && <GrantDetailSheetContent grant={grant} />}
        </div>
      </Suspense>
    </InteractiveSheet>
  );
}
