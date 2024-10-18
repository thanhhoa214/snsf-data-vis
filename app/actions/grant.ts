"use server";

import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

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

export type Top5GrantsByDisciplineNoResponse = Prisma.PromiseReturnType<
  typeof getTop5GrantsByDisciplineNo
>;
export async function getTop5GrantsByDisciplineNo(disciplineNo: number) {
  return await prisma.grant.findMany({
    where: { MainDisciplineNumber: disciplineNo },
    select: {
      GrantNumber: true,
      Title: true,
      AmountGrantedAllSets: true,
      GrantStartDate: true,
      GrantEndDate: true,
      Institute: true,
      InstituteCountry: true,
      GrantToPersonNetwork: {
        select: {
          Person1: {
            select: { FirstName: true, Surname: true, PersonNumber: true },
          },
        },
      },
    },
    orderBy: { AmountGrantedAllSets: "desc" },
    take: 5,
  });
}
