"use client";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FundTrendForDiscipline from "../../components/ui2/FundTrendForDiscipline";
import { getPersonByNumber } from "../actions/persons";
import Top5DisciplinesFewestGrants from "./Top5DisciplinesFewestGrants";
import Top5DisciplinesHighestGrants from "./Top5DisciplinesHighestGrants";
import Top5GrantsByInsititue from "./Top5GrantsByInsititue";

export default function Container() {
  const personNo = useSearchParams().get("PersonNumber");
  const response = useData(personNo ? parseInt(personNo) : 0);

  if (!response) return null;
  const { researcher, uniqueGrants, disciplines, disciplineLineData } =
    response;

  return (
    <>
      <section>
        <h3>Grants</h3>
        <ul className="list-decimal list-inside mb-2">
          {uniqueGrants.map((grant) => (
            <li key={grant.GrantNumber}>
              {grant.Title} ({grant.MainDisciplineNumber})
            </li>
          ))}
        </ul>

        <h3>Disciplines </h3>
        <ul className="flex gap-4">
          {disciplines.map((discipline, i) => (
            <li
              key={discipline.DisciplineNumber}
              className={cn(i < disciplines.length - 1 && "border-r pr-4")}
            >
              {discipline.Discipline}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Institute</h3>
        {researcher.InstituteNumber && (
          <p>
            [{researcher.InstituteNumber}] {researcher.institute?.Institute}
          </p>
        )}
      </section>

      <section className="grid grid-cols-3 gap-4">
        {researcher.institute?.Institute && (
          <Top5GrantsByInsititue institute={researcher.institute.Institute} />
        )}
        <Top5DisciplinesFewestGrants />
        <Top5DisciplinesHighestGrants />
      </section>
      <FundTrendForDiscipline
        disciplines={disciplines.map((d) => ({
          MainDisciplineNumber: d.DisciplineNumber,
          MainDiscipline: d.Discipline,
        }))}
        chartData={disciplineLineData}
      />
    </>
  );
}

const useData = (personNo: number) => {
  const [response, setResponse] =
    useState<Prisma.PromiseReturnType<typeof getPersonByNumber>>();

  useEffect(() => {
    getPersonByNumber(personNo).then(setResponse);
  }, [personNo]);

  return response;
};
