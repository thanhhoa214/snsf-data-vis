"use client";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FundTrendForDiscipline from "../../components/ui2/FundTrendForDiscipline";
import { getDisciplineLineData } from "../actions/discipline";
import { getPersonByNumber } from "../actions/persons";
import Top5DisciplinesFewestGrants from "./Top5DisciplinesFewestGrants";
import Top5DisciplinesHighestGrants from "./Top5DisciplinesHighestGrants";
import Top5GrantsByInsititue from "./Top5GrantsByInsititue";

export default function Container() {
  const personNo = useSearchParams().get("PersonNumber");
  const { researcher, uniqueGrants, disciplines, disciplineLineData } = useData(
    personNo ? parseInt(personNo) : 0
  );

  if (!researcher) return null;

  return (
    <>
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
        {researcher?.Institute && (
          <Top5GrantsByInsititue institute={researcher.Institute} />
        )}
        <Top5DisciplinesFewestGrants />
        <Top5DisciplinesHighestGrants />
      </section>
      <FundTrendForDiscipline
        disciplines={disciplines}
        chartData={disciplineLineData}
      />
    </>
  );
}

const useData = (personNo: number) => {
  const [researcher, setResearcher] =
    useState<Prisma.PromiseReturnType<typeof getPersonByNumber>>();
  const grantDisciplines = useMemo(() => {
    const uniqueGrants: {
      GrantNumber: number;
      Title: string;
      MainDiscipline: string;
    }[] = [];
    const disciplines: {
      MainDiscipline: string;
      MainDisciplineNumber: number;
    }[] = [];

    if (!researcher) return { uniqueGrants, disciplines };
    const grants = [
      ...researcher.GrantToPersonNetwork1.map((net) => net.Grant),
      ...researcher.GrantToPersonNetwork2.map((net) => net.Grant),
    ];

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
    return { uniqueGrants, disciplines };
  }, [researcher]);
  const [disciplineLineData, setDisciplineLineData] = useState<
    Prisma.PromiseReturnType<typeof getDisciplineLineData>
  >([]);

  useEffect(() => {
    getPersonByNumber(personNo).then(setResearcher);
  }, [personNo]);

  useEffect(() => {
    if (grantDisciplines.disciplines.length) {
      getDisciplineLineData(grantDisciplines.disciplines).then(
        setDisciplineLineData
      );
    }
  }, [grantDisciplines.disciplines]);

  return { researcher, ...grantDisciplines, disciplineLineData };
};
