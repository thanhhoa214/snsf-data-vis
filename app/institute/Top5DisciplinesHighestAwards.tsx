import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma/client";
import HorizontalBarChart from "../snsf/HorizontalBarChart";

export default async function Top5DisciplinesHighestAwards({
  institute,
}: {
  institute: string;
}) {
  const grantsByDisciplineCount = await prisma.grant.groupBy({
    by: ["MainDiscipline"],
    _count: { GrantNumber: true },
    orderBy: { _count: { GrantNumber: "desc" } },
    where: { Institute: institute },
  });
  const top5 = grantsByDisciplineCount.filter((item) => !!item.MainDiscipline);

  const data = top5.map((item) => ({
    label: item.MainDiscipline,
    amount: item._count.GrantNumber,
  }));

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>Disciplines</CardTitle>
        <CardDescription>
          Disciplines ordered by number of grants count from 1975 to 2023
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HorizontalBarChart chartData={data} />
      </CardContent>
    </Card>
  );
}
