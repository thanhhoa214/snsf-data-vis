import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { prisma } from "@/lib/prisma/client";
import ColumnChart from "../snsf/ColumnChart";

const chartConfig = {
  amount: { label: "Amount", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export default async function Top5GrantsByInsititue({
  institute,
}: {
  institute: string | null;
}) {
  const top6GrantsByInsititue = await prisma.grant.findMany({
    orderBy: { AmountGrantedAllSets: "desc" },
    where: { Institute: institute },
    take: 5,
  });
  const data = top6GrantsByInsititue.map((item) => ({
    label: item.Title,
    amount: item.AmountGrantedAllSets,
  }));

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
