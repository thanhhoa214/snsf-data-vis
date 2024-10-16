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
    take: 10,
    orderBy: { AmountGrantedAllSets: "desc" },
    select: {
      GrantNumber: true,
      Institute: true,
      AmountGrantedAllSets: true,
      MainDiscipline: true,
      GrantToPersonNetwork: {
        select: { Person1: { select: { FirstName: true, Surname: true } } },
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 grants get most award</CardTitle>
        <CardDescription>
          Showcase the trending and funding allocation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>Grant</TableHead>
              <TableHead>Institute/Researcher Name</TableHead>
              <TableHead>Research Field</TableHead>
              <TableHead className="text-right">Award</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top5GrantMostAward.map((grant) => (
              <TableRow key={grant.GrantNumber}>
                <TableCell>{grant.GrantNumber}</TableCell>
                <TableCell>{grant.Institute}</TableCell>
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
