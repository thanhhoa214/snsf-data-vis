import Navbar from "@/components/ui2/Navbar";
import { prisma } from "@/lib/prisma/client";
import { getInstituteByNumber } from "../actions/institute";
import Top5DisciplinesHighestAwards from "./Top5DisciplinesHighestAwards";

export default async function Home() {
  const grantCount = await prisma.grant.count();
  const ins = prisma.institute.count();
  const institute = await getInstituteByNumber(0);

  if (!institute) {
    return <main>No institute found</main>;
  }

  return (
    <main className="space-y-4">
      <Navbar />
      <h1 className="mb-4 text-center">Institute Dashboard</h1>
      <p>
        Insti No: {grantCount} {ins}
      </p>
      {/* <PersonFilter
        serverItems={await searchInstitutes()}
        initItem={institute}
        itemKey="InstituteNumber"
        itemLabel="Institute"
        onSearch={searchInstitutes}
      /> */}
      <Top5DisciplinesHighestAwards institute={institute.Institute} />
      {/* <FundTrendForDiscipline
        disciplines={uniqueDisciplines}
        chartData={chartData}
      /> */}
    </main>
  );
}
