import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma/client";
import { shortenNumber } from "@/lib/utils";

export default async function Top5GrantMostAward() {
  const top5GrantMostAward = await prisma.grant.findMany({
    take: 5,
    orderBy: { AmountGrantedAllSets: "desc" },
    select: {
      GrantNumber: true,
      Institute: true,
      AmountGrantedAllSets: true,
      MainDiscipline: true,
      GrantToPerson: {
        select: { person: { select: { FirstName: true, Surname: true } } },
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 grants get most award</CardTitle>
        <CardDescription>
          Showcase the trending and funding allocation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grant Number</TableHead>
              <TableHead>Institute or Researcher Names</TableHead>
              <TableHead>Research Field</TableHead>
              <TableHead className="text-right">Award Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top5GrantMostAward.map((grant) => (
              <TableRow key={grant.GrantNumber}>
                <TableCell>{grant.GrantNumber}</TableCell>
                <TableCell>
                  {grant.Institute ||
                    `${grant.GrantToPerson[0].person.FirstName} ${grant.GrantToPerson[0].person.Surname}`}
                </TableCell>
                <TableCell>{grant.MainDiscipline}</TableCell>
                <TableCell className="text-right">
                  {shortenNumber(grant.AmountGrantedAllSets)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
