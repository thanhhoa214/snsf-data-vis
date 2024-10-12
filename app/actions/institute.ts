"use server";

import { prisma } from "@/lib/prisma/client";

export async function searchInstitutes(search = "") {
  return await prisma.institute.findMany({
    where: !search
      ? {}
      : !isNaN(+search)
      ? { InstituteNumber: +search }
      : {
          OR: [
            { Institute: { contains: search } },
            { InstituteCountry: { contains: search } },
          ],
        },
    take: 20,
  });
}
