import { prisma } from "@/lib/prisma/client";
import FundTrendForDiscipline, {
  FundTrendForDisciplineProps,
} from "./FundTrendForDiscipline";
import ResearcherFilter from "./ResearcherFilter";
import Top5DisciplinesFewestGrants from "./Top5DisciplinesFewestGrants";
import Top5GrantsByInsititue from "./Top5GrantsByInsititue";

export default async function Page({
  searchParams,
}: {
  searchParams: { person_no: string };
}) {
  const personNo = Number(searchParams.person_no ?? "0");
  const researcher = await prisma.person.findFirst({
    where: personNo ? { PersonNumber: personNo } : {},
  });

  const grant = await prisma.grant.findFirst({
    where: personNo
      ? {
          GrantToPersonNetwork: {
            some: { PersonNumber1: researcher?.PersonNumber },
          },
        }
      : {},
  });

  if (!grant) {
    return <main>No grants found for researcher</main>;
  }

  const grantsByYear = await prisma.$queryRaw`
    SELECT 
      CAST(SUBSTR(GrantStartDate, -4) AS INTEGER) AS year,
      SUM(AmountGrantedAllSets) AS amount
    FROM 
      Grant
    WHERE 
      MainDisciplineNumber = ${grant.MainDisciplineNumber}
    GROUP BY 
      year
    ORDER BY 
      year ASC;
  `;

  const chartData = (
    grantsByYear as FundTrendForDisciplineProps["chartData"]
  ).map((item) => ({
    year: item.year.toString(),
    amount: item.amount || 0,
  }));

  return (
    <main className="space-y-4">
      <h1 className="mb-4">Researcher Dashboard</h1>
      <ResearcherFilter personNo={personNo} />

      <div className="grid grid-cols-2 gap-4">
        <Top5GrantsByInsititue />
        <Top5DisciplinesFewestGrants />
      </div>
      <FundTrendForDiscipline
        disciplineNo={grant.MainDisciplineNumber}
        disciplineName={grant.MainDiscipline}
        chartData={chartData}
      />
    </main>
  );
}
