"use server";
import { prisma } from "@/lib/prisma/client";

export type DisciplineLineChartData = Array<
  { year: string } & Record<string, string>
>;

export async function getDisciplineLineData(disciplineNos: number[]) {
  const disciplineSelectors = disciplineNos
    .map(
      (MainDisciplineNumber) =>
        `SUM(CASE WHEN MainDisciplineNumber = '${MainDisciplineNumber}' THEN CAST(AmountGrantedAllSets AS INTEGER) ELSE 0 END) AS '${MainDisciplineNumber}'`
    )
    .join(", ");
  const grantsByYear = (await prisma.$queryRawUnsafe(
    `SELECT 
          CAST(SUBSTR(GrantStartDate, -4) AS INTEGER) AS year,
          ${disciplineSelectors}
        FROM 
          Grant
        GROUP BY 
          year
        ORDER BY 
          year ASC;`
  )) as DisciplineLineChartData;

  const chartData = grantsByYear.map((item) => ({
    year: item.year.toString(),
    ...disciplineNos.reduce(
      (acc, MainDisciplineNumber) => ({
        ...acc,
        [MainDisciplineNumber]: parseInt(item[MainDisciplineNumber]),
      }),
      {}
    ),
  }));

  return chartData as DisciplineLineChartData;
}

export async function getTop5DisciplinesInstituteByGrantCount(
  institute: string
) {
  const top6GrantsByDisciplineCount = await prisma.grant.groupBy({
    by: ["MainDisciplineNumber"],
    _count: { GrantNumber: true },
    orderBy: { _count: { GrantNumber: "desc" } },
    take: 6,
    where: { Institute: institute },
  });
  const top5 = top6GrantsByDisciplineCount
    .filter((item) => !!item.MainDisciplineNumber)
    .slice(0, 5);

  const disciplines = await getDisciplinesByDisciplineNumber(
    top5.map((item) => item.MainDisciplineNumber)
  );

  const data = top5.map((item) => ({
    label:
      disciplines.find((d) => d.DisciplineNumber === item.MainDisciplineNumber)
        ?.Discipline ?? "Unknown",
    amount: item._count.GrantNumber,
  }));
  return data;
}

export async function getDisciplinesByDisciplineNumber(
  disciplineNumbers: number[]
) {
  return prisma.discipline.findMany({
    where: { DisciplineNumber: { in: disciplineNumbers } },
  });
}
