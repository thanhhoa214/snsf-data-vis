"use server";

import { prisma } from "@/lib/prisma/client";

// func to search a person by name, or by person number
export async function searchPerson(search = "") {
  // if the search is a string, search by name
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
    select: { PersonNumber: true, Surname: true, FirstName: true },
    take: 20,
  });
}
