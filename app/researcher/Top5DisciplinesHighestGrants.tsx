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
import { getTop5DisciplinesByGrantCount } from "../actions/grant";
import ColumnChart from "../snsf/ColumnChart";

const useTop5DisciplinesByGrantCount = () => {
  const [data, setData] = useState<
    Prisma.PromiseReturnType<typeof getTop5DisciplinesByGrantCount>
  >([]);

  useEffect(() => {
    getTop5DisciplinesByGrantCount().then(setData);
  }, []);

  return data;
};

export default function Top5DisciplinesHighestGrants() {
  const data = useTop5DisciplinesByGrantCount();
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
