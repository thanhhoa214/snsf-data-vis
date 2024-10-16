import FundTrendForDiscipline from "@/components/ui2/FundTrendForDiscipline";
import Navbar from "@/components/ui2/Navbar";
import PersonFilter from "@/components/ui2/PersonFilter";
import { shortenNumber } from "@/lib/utils";
import { getDisciplineLineData } from "../actions/discipline";
import { getInstituteByNumber, searchInstitutes } from "../actions/institute";
import Researchers from "./Researchers";
import Top5DisciplinesHighestAwards from "./Top5DisciplinesHighestAwards";

export default async function Page({
  searchParams,
}: {
  searchParams: { InstituteNumber: string };
}) {
  const instituteNo = Number(searchParams.InstituteNumber ?? "0");
  const institute = await getInstituteByNumber(instituteNo);

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
      <p className="text-center text-sm text-muted-foreground">
        {institute.ResearchInstitution && institute.ResearchInstitution + " •"}{" "}
        {institute.InstituteCountry} • {shortenNumber(institute._count.grants)}{" "}
        grants • {shortenNumber(institute._count.persons)} researchers
      </p>

      <div className="flex items-start gap-4">
        <Researchers institute={institute} />
        <Top5DisciplinesHighestAwards institute={institute.Institute} />
      </div>
      <FundTrendForDiscipline
        disciplines={uniqueDisciplines}
        chartData={chartData}
      />
    </main>
  );
}
