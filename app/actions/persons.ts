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

export async function getPersonByNumber(personNo: number) {
  return prisma.person.findFirst({
    where: personNo ? { PersonNumber: personNo } : {},
    include: {
      GrantToPersonNetwork1: {
        select: {
          Grant: {
            select: {
              GrantNumber: true,
              Title: true,
              MainDisciplineNumber: true,
              MainDiscipline: true,
            },
          },
        },
      },
      GrantToPersonNetwork2: {
        select: {
          Grant: {
            select: {
              GrantNumber: true,
              Title: true,
              MainDisciplineNumber: true,
              MainDiscipline: true,
            },
          },
        },
      },
    },
  });
}
