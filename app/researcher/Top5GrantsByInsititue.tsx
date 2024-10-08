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

export default async function Top5GrantsByInsititue() {
  const top6GrantsByInsititue = await prisma.grant.groupBy({
    by: ["Institute"],
    _count: { GrantNumber: true },
    orderBy: { _count: { GrantNumber: "desc" } },
    take: 6,
  });
  const top5 = top6GrantsByInsititue
    .filter((item) => !!item.Institute)
    .slice(0, 5);

  const data = top5.map((item) => ({
    label: item.Institute || "Other countries",
    amount: item._count.GrantNumber,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Grants Vs Institue</CardTitle>
        <CardDescription>
          Top 5 institues that received the highest number of grants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColumnChart chartConfig={chartConfig} chartData={data} />
      </CardContent>
    </Card>
  );
}
