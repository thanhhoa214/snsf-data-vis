"use server";

import { prisma } from "@/lib/prisma/client";
import { getDisciplineLineData } from "./discipline";

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
  const person = await prisma.person.findFirst({
    where: personNo ? { PersonNumber: personNo } : {},
    include: {
      institute: { select: { Institute: true } },
      GrantToPersonNetwork1: {
        select: {
          Grant: {
            select: {
              GrantNumber: true,
              Title: true,
              MainDisciplineNumber: true,
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
            },
          },
        },
      },
    },
  });
  if (!person) return null;
  const disciplineNos = person.GrantToPersonNetwork1.map(
    (net) => net.Grant.MainDisciplineNumber
  ).concat(
    person.GrantToPersonNetwork2.map((net) => net.Grant.MainDisciplineNumber)
  );

  const uniqueDisciplineNos = Array.from(new Set(disciplineNos));
  const disciplines = await prisma.discipline.findMany({
    where: { DisciplineNumber: { in: uniqueDisciplineNos } },
  });

  const disciplineLineData = await getDisciplineLineData(uniqueDisciplineNos);

  const uniqueGrants: {
    GrantNumber: number;
    Title: string;
    MainDisciplineNumber: number;
  }[] = [];
  const grants = [
    ...person.GrantToPersonNetwork1.map((net) => net.Grant),
    ...person.GrantToPersonNetwork2.map((net) => net.Grant),
  ];

  for (const grant of grants) {
    if (!uniqueGrants.some((g) => g.GrantNumber === grant.GrantNumber)) {
      uniqueGrants.push(grant);
    }
  }

  return { researcher: person, disciplines, disciplineLineData, uniqueGrants };
}
