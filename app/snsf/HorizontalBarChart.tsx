"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { shortenNumber } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

export default function HorizontalBarChart<T>({
  chartData,
  chartConfig = { amount: { label: "Amount", color: "hsl(var(--chart-1))" } },
}: {
  chartData: T[];
  chartConfig?: ChartConfig;
}) {
  return (
    <ChartContainer config={chartConfig} className="h-96">
      <BarChart layout="vertical" accessibilityLayer data={chartData}>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="label"
          type="category"
          tickLine={false}
          tickMargin={0}
          axisLine={false}
          width={100}
        />
        <XAxis type="number" axisLine={false} tickLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideIndicator />}
        />
        <Bar dataKey="amount" fill="var(--color-amount)" radius={8}>
          <LabelList
            position="right"
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
