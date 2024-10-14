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

export const getTop5GrantsByInsititue = async (institute: string) => {
  const top5GrantsByInsititue = await prisma.grant.findMany({
    orderBy: { AmountGrantedAllSets: "desc" },
    where: { Institute: institute },
    take: 5,
  });

  const data = top5GrantsByInsititue.map((item) => ({
    label: item.Title,
    amount: item.AmountGrantedAllSets,
  }));
  return data;
};

export const getTop5GrantsByDisciplineCount = async () => {
  const top5GrantsByDisciplineCount = await prisma.grant.groupBy({
    by: ["MainDiscipline"],
    _count: { GrantNumber: true },
    orderBy: { _count: { GrantNumber: "asc" } },
    take: 5,
  });
  const top5 = top5GrantsByDisciplineCount
    .filter((item) => !!item.MainDiscipline)
    .slice(0, 5);

  const data = top5.map((item) => ({
    label: item.MainDiscipline,
    amount: item._count.GrantNumber,
  }));

  return data;
};

export const getTop5DisciplinesByGrantCount = async () => {
  const top5GrantsByDisciplineCount = await prisma.grant.groupBy({
    by: ["MainDiscipline"],
    _count: { GrantNumber: true },
    orderBy: { _count: { GrantNumber: "desc" } },
    take: 5,
  });
  const top5 = top5GrantsByDisciplineCount
    .filter((item) => !!item.MainDiscipline)
    .slice(0, 5);

  const data = top5.map((item) => ({
    label: item.MainDiscipline,
    amount: item._count.GrantNumber,
  }));

  return data;
};
