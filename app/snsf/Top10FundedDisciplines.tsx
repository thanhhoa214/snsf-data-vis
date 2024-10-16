import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { prisma } from "@/lib/prisma/client";
import HorizontalBarChart from "./HorizontalBarChart";

const chartConfig = {
  amount: { label: "Amount", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export default async function Top10FundedDisciplines() {
  const top10FundedDisciplines = await prisma.grant.groupBy({
    by: ["MainDiscipline"],
    _sum: { AmountGrantedAllSets: true },
    orderBy: { _sum: { AmountGrantedAllSets: "desc" } },
    take: 10,
  });

  const data = top10FundedDisciplines.map((country) => ({
    label: country.MainDiscipline || "Other countries",
    amount: country._sum.AmountGrantedAllSets,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Funded Disciplines</CardTitle>
        <CardDescription>
          Top 10 disciplines that received the most funding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HorizontalBarChart chartConfig={chartConfig} chartData={data} />
      </CardContent>
    </Card>
  );
}
