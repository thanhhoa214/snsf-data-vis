"use client";
import { Prisma } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FundTrendForDiscipline from "../../components/ui2/FundTrendForDiscipline";
import { getDisciplineLineData } from "../actions/discipline";
import { getInstituteByNumber } from "../actions/institute";
import Top5DisciplinesHighestAwards from "./Top5DisciplinesHighestAwards";

export default function Container() {
  const instituteNo = useSearchParams().get("PersonNumber");
  const { institute, disciplines, disciplineLineData } = useData(
    instituteNo ? parseInt(instituteNo) : 0
  );

  if (!institute) return null;

  return (
    <>
      <Top5DisciplinesHighestAwards institute={institute.Institute} />
      <FundTrendForDiscipline
        disciplines={disciplines}
        chartData={disciplineLineData}
      />
    </>
  );
}

const useData = (instituteNo: number) => {
  const [institute, setInstitute] =
    useState<Prisma.PromiseReturnType<typeof getInstituteByNumber>>();

  const disciplines = useMemo(() => {
    const uniqueDisciplines: Array<{
      MainDiscipline: string;
      MainDisciplineNumber: number;
    }> = [];
    if (!institute) return uniqueDisciplines;

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
    return uniqueDisciplines;
  }, [institute]);

  const [disciplineLineData, setDisciplineLineData] = useState<
    Prisma.PromiseReturnType<typeof getDisciplineLineData>
  >([]);

  useEffect(() => {
    getInstituteByNumber(instituteNo).then(setInstitute);
  }, [instituteNo]);

  useEffect(() => {
    if (disciplines.length) {
      getDisciplineLineData(disciplines).then(setDisciplineLineData);
    }
  }, [disciplines]);

  return { institute, disciplines, disciplineLineData };
};
