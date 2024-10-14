import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma/client";
import ColumnChart from "../snsf/ColumnChart";

export default async function Top5DisciplinesHighestAwards({
  institute,
}: {
  institute: string;
}) {
  const top6GrantsByDisciplineCount = await prisma.grant.groupBy({
    by: ["MainDiscipline"],
    _count: { GrantNumber: true },
    orderBy: { _count: { GrantNumber: "desc" } },
    take: 6,
    where: { Institute: institute },
  });
  const top5 = top6GrantsByDisciplineCount
    .filter((item) => !!item.MainDiscipline)
    .slice(0, 5);

  const data = top5.map((item) => ({
    label: item.MainDiscipline,
    amount: item._count.GrantNumber,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Disciplines With Highest Granted Count</CardTitle>
        <CardDescription>
          Disciplines with the highest number of grants from 1975 to 2023
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColumnChart chartData={data} />
      </CardContent>
    </Card>
  );
}
