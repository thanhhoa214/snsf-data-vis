"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { getTop5GrantsByInsititue } from "../actions/grant";
import ColumnChart from "../snsf/ColumnChart";

const chartConfig = {
  amount: { label: "Amount", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const useTop5GrantsByInsititue = (institute: string) => {
  const [data, setData] = useState<
    Prisma.PromiseReturnType<typeof getTop5GrantsByInsititue>
  >([]);

  useEffect(() => {
    getTop5GrantsByInsititue(institute).then(setData);
  }, [institute]);

  return data;
};

export default function Top5GrantsByInsititue({
  institute,
}: {
  institute: string;
}) {
  const data = useTop5GrantsByInsititue(institute);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Grants in Institute</CardTitle>
        <CardDescription>
          Top 5 grants received the highest amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColumnChart chartConfig={chartConfig} chartData={data} />
      </CardContent>
    </Card>
  );
}
