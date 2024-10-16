import GrantDetailSheetContent from "@/components/ui2/GrantDetailSheet";
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
      GrantToPersonNetwork: {
        include: {
          Person1: true,
          Person2: true,
        },
      },
    },
  });
  if (!grant) return <p>Grant not found</p>;

  return (
    <main>
      <h2 className="mb-2">{grant?.Title}</h2>
      <Suspense fallback={<div>Loading...</div>}>
        {grant && <GrantDetailSheetContent grant={grant} />}
      </Suspense>
    </main>
  );
}
