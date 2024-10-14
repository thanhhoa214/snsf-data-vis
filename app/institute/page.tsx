import FundTrendForDiscipline from "@/components/ui2/FundTrendForDiscipline";
import Navbar from "@/components/ui2/Navbar";
import PersonFilter from "@/components/ui2/PersonFilter";
import { prisma } from "@/lib/prisma/client";
import { getDisciplineLineData } from "@/lib/prisma/discipline";
import { searchInstitutes } from "../actions/institute";
import Top5DisciplinesHighestAwards from "./Top5DisciplinesHighestAwards";

export default async function Page({
  searchParams,
}: {
  searchParams: { InstituteNumber: string };
}) {
  const instituteNo = Number(searchParams.InstituteNumber ?? "0");
  const institute = await prisma.institute.findFirst({
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

  if (!institute) {
    return <main>No institute found</main>;
  }

  const uniqueDisciplines: Array<{
    MainDiscipline: string;
    MainDisciplineNumber: number;
  }> = [];
  institute.grants.forEach((grant) => {
    if (
      !uniqueDisciplines.some(
        (discipline) =>
          discipline.MainDisciplineNumber === grant.MainDisciplineNumber
      )
    ) {
      uniqueDisciplines.push({
        MainDiscipline: grant.MainDiscipline,
        MainDisciplineNumber: grant.MainDisciplineNumber,
      });
    }
  });
  const chartData = await getDisciplineLineData(uniqueDisciplines);

  return (
    <main className="space-y-4">
      <Navbar />
      <h1 className="mb-4 text-center">Institute Dashboard</h1>

      <PersonFilter
        serverItems={await searchInstitutes()}
        initItem={institute}
        itemKey="InstituteNumber"
        itemLabel="Institute"
        onSearch={searchInstitutes}
      />
      <Top5DisciplinesHighestAwards institute={institute.Institute} />
      <FundTrendForDiscipline
        disciplines={uniqueDisciplines}
        chartData={chartData}
      />
    </main>
  );
}
