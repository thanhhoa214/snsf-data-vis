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
import { cn, shortenNumber } from "@/lib/utils";
import { Fragment, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Checkbox } from "../ui/checkbox";

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
  const [visibleDisciplineNumbers, setVisibleDisciplineNumbers] = useState<
    number[]
  >(disciplines.map((d) => d.MainDisciplineNumber)); // Track visible disciplines

  useEffect(() => {
    setVisibleDisciplineNumbers(disciplines.map((d) => d.MainDisciplineNumber));
  }, [disciplines]);

  const chartConfig = disciplines.reduce((acc, discipline, i) => {
    acc[discipline.MainDisciplineNumber] = {
      label: discipline.MainDiscipline,
      color: `hsl(var(--chart-${i + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  const toggleDiscipline = (number: number) => {
    setVisibleDisciplineNumbers((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Trends for disciplines</CardTitle>
        <CardDescription>The funding trends over years</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex gap-x-4 flex-wrap mb-4">
          {disciplines.map((discipline) => (
            <li
              key={discipline.MainDisciplineNumber}
              className={cn(
                "inline-flex items-center gap-2",
                visibleDisciplineNumbers.includes(
                  discipline.MainDisciplineNumber
                )
                  ? "text-gray-900"
                  : "text-gray-400"
              )}
            >
              <Checkbox
                id={`check${discipline.MainDisciplineNumber.toString()}`}
                checked={visibleDisciplineNumbers.includes(
                  discipline.MainDisciplineNumber
                )}
                onCheckedChange={() =>
                  toggleDiscipline(discipline.MainDisciplineNumber)
                }
              />
              <label
                htmlFor={`check${discipline.MainDisciplineNumber.toString()}`}
              >
                {discipline.MainDiscipline}
              </label>
            </li>
          ))}
        </ul>
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
              <Fragment key={discipline.MainDisciplineNumber}>
                {visibleDisciplineNumbers.includes(
                  discipline.MainDisciplineNumber
                ) && (
                  <>
                    <Area
                      dataKey={discipline.MainDisciplineNumber}
                      type="natural"
                      // fill={`var(--color-${discipline.MainDisciplineNumber})`}
                      fill={`url(#fill${discipline.MainDisciplineNumber})`}
                      fillOpacity={0.4}
                      stroke={`var(--color-${discipline.MainDisciplineNumber})`}
                    />
                    <defs>
                      <linearGradient
                        id={`fill${discipline.MainDisciplineNumber}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={`var(--color-${discipline.MainDisciplineNumber})`}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={`var(--color-${discipline.MainDisciplineNumber})`}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                  </>
                )}
              </Fragment>
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
