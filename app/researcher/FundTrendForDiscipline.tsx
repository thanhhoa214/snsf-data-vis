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

export interface FundTrendForDisciplineProps {
  disciplines: {
    MainDiscipline: string;
    MainDisciplineNumber: number;
  }[];
  chartData: Array<{ year: string } & Record<string, string>>;
}

export default function FundTrendForDiscipline({
  disciplines,
  chartData,
}: FundTrendForDisciplineProps) {
  const chartConfig = disciplines.reduce((acc, discipline, i) => {
    acc[discipline.MainDisciplineNumber] = {
      label: discipline.MainDiscipline,
      color: `hsl(var(--chart-${i + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Trends for disciplines</CardTitle>
        <CardDescription>The funding trends over years</CardDescription>
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
            {disciplines.map((discipline) => (
              <Area
                key={discipline.MainDisciplineNumber}
                dataKey={discipline.MainDisciplineNumber}
                type="natural"
                fill={`var(--color-${discipline.MainDisciplineNumber})`}
                fillOpacity={0.4}
                stroke={`var(--color-${discipline.MainDisciplineNumber})`}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
