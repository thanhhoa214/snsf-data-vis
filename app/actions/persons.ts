"use server";

import { prisma } from "@/lib/prisma/client";

export async function searchPerson(search = "") {
  return await prisma.person.findMany({
    where: !search
      ? {}
      : !isNaN(+search)
      ? { PersonNumber: +search }
      : {
          OR: [
            { Surname: { contains: search } },
            { FirstName: { contains: search } },
          ],
        },
    take: 20,
  });
}
