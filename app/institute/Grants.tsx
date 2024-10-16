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
import Link from "next/link";
import { InstituteByNumber } from "../actions/institute";

export default async function GrantsInInstitute({
  institute,
}: {
  institute: InstituteByNumber;
}) {
  if (!institute) return null;

  const top5GrantMostAward = await prisma.grant.findMany({
    orderBy: { AmountGrantedAllSets: "desc" },
    select: {
      GrantNumber: true,
      Title: true,
      AmountGrantedAllSets: true,
      MainDiscipline: true,
      GrantToPersonNetwork: {
        select: {
          Person1: {
            select: { PersonNumber: true, FirstName: true, Surname: true },
          },
        },
      },
      GrantStartDate: true,
      GrantEndDate: true,
      InstituteCountry: true,
    },
    where: { Institute: institute.Institute },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grants</CardTitle>
        <CardDescription>
          All grants by researchers in this institute
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-auto">
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead>Grant</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Researchers</TableHead>
                <TableHead>Research Field</TableHead>
                <TableHead>Start-end dates</TableHead>
                <TableHead>Institute Country</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top5GrantMostAward.map((grant) => {
                const uniqueResearchers = new Set<number>();
                grant.GrantToPersonNetwork.forEach((person) => {
                  uniqueResearchers.add(person.Person1.PersonNumber);
                });
                const researchers = Array.from(uniqueResearchers).map(
                  (person, i, arr) => {
                    const researcher = grant.GrantToPersonNetwork.find(
                      (p) => p.Person1.PersonNumber === person
                    );
                    if (!researcher) return null;
                    return (
                      <>
                        {" "}
                        <Link
                          key={person}
                          href={`/researcher?ResearcherNumber=${person}`}
                        >
                          {`${researcher.Person1.FirstName || ""} ${
                            researcher.Person1.Surname
                          }`}
                        </Link>
                        {i != arr.length - 1 ? "," : ""}
                      </>
                    );
                  }
                );
                return (
                  <TableRow key={grant.GrantNumber}>
                    <TableCell>
                      <Link
                        href={`/grant-detail/${grant.GrantNumber}`}
                        className="inline-flex gap-1"
                      >
                        {grant.GrantNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{grant.Title}</TableCell>
                    <TableCell>{researchers}</TableCell>
                    <TableCell>{grant.MainDiscipline}</TableCell>
                    <TableCell>
                      {grant.GrantStartDate} - {grant.GrantEndDate}
                    </TableCell>
                    <TableCell>{grant.InstituteCountry}</TableCell>
                    <TableCell className="text-right">
                      {shortenNumber(grant.AmountGrantedAllSets)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
