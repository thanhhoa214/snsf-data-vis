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
import { getTop5GrantsByDisciplineCount } from "../actions/grant";
import ColumnChart from "../snsf/ColumnChart";

const useTop5GrantsByDisciplineCount = () => {
  const [data, setData] = useState<
    Prisma.PromiseReturnType<typeof getTop5GrantsByDisciplineCount>
  >([]);

  useEffect(() => {
    getTop5GrantsByDisciplineCount().then(setData);
  }, []);

  return data;
};

export default function Top5DisciplinesFewestGrants() {
  const data = useTop5GrantsByDisciplineCount();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Disciplines With Fewest Granted Count</CardTitle>
        <CardDescription>
          Disciplines with the fewest number of grants from 1975 to 2023
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColumnChart chartData={data} />
      </CardContent>
    </Card>
  );
}
