"use server";

import { prisma } from "@/lib/prisma/client";

export async function searchGrant(search = "") {
  // if the search is a string, search by title
  return await prisma.grant.findMany({
    where: !search
      ? {}
      : !isNaN(+search)
      ? { GrantNumber: +search }
      : { Title: { contains: search } },
    select: { GrantNumber: true, Title: true },
    take: 20,
  });
}
