"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { shortenNumber } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

export default function ColumnChart<T>({
  chartData,
  chartConfig,
}: {
  chartData: T[];
  chartConfig: ChartConfig;
}) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideIndicator />}
        />
        <Bar dataKey="amount" fill="var(--color-amount)" radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
            formatter={shortenNumber}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
