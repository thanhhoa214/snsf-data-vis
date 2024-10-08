"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { shortenNumber } from "@/lib/utils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const description = "A simple area chart";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export interface FundTrendForDisciplineProps {
  disciplineNo: number;
  disciplineName: string;
  chartData: Array<{ year: string; amount: number }>;
}

export default function FundTrendForDiscipline({
  disciplineNo,
  disciplineName,
  chartData,
}: FundTrendForDisciplineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Funding Trends for {disciplineName} ({disciplineNo})
        </CardTitle>
        <CardDescription>
          The funding trends for {disciplineName} over years
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => shortenNumber(value).toString()}
            />
            <XAxis dataKey="year" tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="amount"
              type="natural"
              fill="var(--color-amount)"
              fillOpacity={0.4}
              stroke="var(--color-amount)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
