"use server";
import { prisma } from "@/lib/prisma/client";

export async function getStatistics() {
  const totalFundedGrants = prisma.grant.count();
  const totalFundedAmount = prisma.grant.aggregate({
    _sum: { AmountGrantedAllSets: true },
  });
  const totalAwards = prisma.outputAward.count();
  const totalInstitutes = prisma.institute.count();
  const totalDisciplines = prisma.discipline.count();

  return Promise.all([
    totalFundedGrants,
    totalFundedAmount,
    totalAwards,
    totalInstitutes,
    totalDisciplines,
  ]);
}
