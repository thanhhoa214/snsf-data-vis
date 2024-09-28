import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { prisma } from "@/lib/prisma/client";
import ColumnChart from "./ColumnChart";

const chartConfig = {
  amount: { label: "Funded amount", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export default async function Top10FundedCountries() {
  const top10FundedCountries = await prisma.grant.groupBy({
    by: ["InstituteCountry"],
    _sum: { AmountGrantedAllSets: true },
    orderBy: { _sum: { AmountGrantedAllSets: "desc" } },
    take: 10,
  });

  const data = top10FundedCountries.map((country) => ({
    label: country.InstituteCountry || "Other countries",
    amount: country._sum.AmountGrantedAllSets,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Funded Countries</CardTitle>
        <CardDescription>
          Top 10 countries that received the most funding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColumnChart chartConfig={chartConfig} chartData={data} />
      </CardContent>
    </Card>
  );
}
