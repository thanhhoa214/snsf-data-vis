"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { getTop5DisciplinesInstituteByGrantCount } from "../actions/discipline";
import ColumnChart from "../snsf/ColumnChart";

const useTop5DisciplinesInstituteByGrantCount = (institute: string) => {
  const [data, setData] = useState<
    Prisma.PromiseReturnType<typeof getTop5DisciplinesInstituteByGrantCount>
  >([]);
  useEffect(() => {
    getTop5DisciplinesInstituteByGrantCount(institute).then(setData);
  }, [institute]);

  return data;
};

export default function Top5DisciplinesHighestAwards({
  institute,
}: {
  institute: string;
}) {
  const data = useTop5DisciplinesInstituteByGrantCount(institute);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Disciplines With Highest Granted Count</CardTitle>
        <CardDescription>
          Disciplines with the highest number of grants from 1975 to 2023
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColumnChart chartData={data} />
      </CardContent>
    </Card>
  );
}
