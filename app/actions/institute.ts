"use server";

import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

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

export type InstituteByNumber = Prisma.PromiseReturnType<
  typeof getInstituteByNumber
>;
export async function getInstituteByNumber(instituteNo: number) {
  return prisma.institute.findFirst({
    where: instituteNo ? { InstituteNumber: instituteNo } : {},
    include: {
      grants: {
        select: {
          MainDiscipline: true,
          MainDisciplineNumber: true,
        },
      },
    },
  });
}
