import Navbar from "@/components/ui2/Navbar";
import PersonFilter from "@/components/ui2/PersonFilter";
import { prisma } from "@/lib/prisma/client";
import { getDisciplineLineData } from "@/lib/prisma/discipline";
import { cn } from "@/lib/utils";
import FundTrendForDiscipline from "../../components/ui2/FundTrendForDiscipline";
import { searchPerson } from "../actions/persons";
import Top5DisciplinesFewestGrants from "./Top5DisciplinesFewestGrants";
import Top5DisciplinesHighestGrants from "./Top5DisciplinesHighestGrants";
import Top5GrantsByInsititue from "./Top5GrantsByInsititue";

export default async function Page({
  searchParams,
}: {
  searchParams: { PersonNumber: string };
}) {
  const personNo = Number(searchParams.PersonNumber ?? "0");
  const researcher = await prisma.person.findFirst({
    where: personNo ? { PersonNumber: personNo } : {},
    include: {
      GrantToPersonNetwork1: {
        select: {
          Grant: {
            select: {
              GrantNumber: true,
              Title: true,
              MainDisciplineNumber: true,
              MainDiscipline: true,
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
              MainDiscipline: true,
            },
          },
        },
      },
    },
  });

  if (!researcher) {
    return <main>No researcher selected</main>;
  }

  const grants = [
    ...researcher.GrantToPersonNetwork1.map((net) => net.Grant),
    ...researcher.GrantToPersonNetwork2.map((net) => net.Grant),
  ];

  const uniqueGrants: {
    GrantNumber: number;
    Title: string;
    MainDiscipline: string;
  }[] = [];
  const disciplines: {
    MainDiscipline: string;
    MainDisciplineNumber: number;
  }[] = [];

  for (const grant of grants) {
    if (!uniqueGrants.some((g) => g.GrantNumber === grant.GrantNumber)) {
      uniqueGrants.push(grant);
    }
    if (
      !disciplines.some(
        (d) => d.MainDisciplineNumber === grant.MainDisciplineNumber
      )
    ) {
      disciplines.push({
        MainDiscipline: grant.MainDiscipline,
        MainDisciplineNumber: grant.MainDisciplineNumber,
      });
    }
  }

  const grant = await prisma.grant.findFirst({
    where: personNo
      ? {
          GrantToPersonNetwork: {
            some: { PersonNumber1: researcher.PersonNumber },
          },
        }
      : {},
  });

  if (!grant) {
    return <main>No grants found for researcher</main>;
  }

  const chartData = await getDisciplineLineData(disciplines);

  return (
    <main className="space-y-4">
      <Navbar />
      <h1 className="mb-4 text-center">Researcher Dashboard</h1>

      <PersonFilter
        serverItems={await searchPerson()}
        initItem={researcher}
        itemKey="PersonNumber"
        itemLabel="Surname"
        onSearch={searchPerson}
      />

      <section>
        <h3>Grants</h3>
        <ul className="list-decimal list-inside mb-2">
          {uniqueGrants.map((grant) => (
            <li key={grant.GrantNumber}>
              {grant.Title} ({grant.MainDiscipline})
            </li>
          ))}
        </ul>

        <h3>Disciplines </h3>
        <ul className="flex gap-4">
          {disciplines.map((discipline, i) => (
            <li
              key={discipline.MainDisciplineNumber}
              className={cn(i < disciplines.length - 1 && "border-r pr-4")}
            >
              {discipline.MainDiscipline}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Institute</h3>
        {researcher.InstituteNumber && (
          <p>
            [{researcher.InstituteNumber}] {researcher.Institute}
          </p>
        )}
      </section>

      <section className="grid grid-cols-3 gap-4">
        {researcher.InstituteNumber && (
          <Top5GrantsByInsititue institute={researcher.Institute} />
        )}
        <Top5DisciplinesFewestGrants />
        <Top5DisciplinesHighestGrants />
      </section>
      <FundTrendForDiscipline disciplines={disciplines} chartData={chartData} />
    </main>
  );
}
