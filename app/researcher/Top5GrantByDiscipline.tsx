"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortenNumber } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getTop5GrantsByDisciplineNo,
  Top5GrantsByDisciplineNoResponse,
} from "../actions/grant";

export default function Top5GrantByDiscipline({
  disciplines,
  selectedDisciplineNo,
  serverResponse,
}: {
  disciplines: { MainDiscipline: string; MainDisciplineNumber: number }[];
  selectedDisciplineNo: number;
  serverResponse: Top5GrantsByDisciplineNoResponse;
}) {
  const [discipline, setDiscipline] = useState(selectedDisciplineNo);
  const [grants, setGrants] = useState(serverResponse);

  useEffect(() => {
    setDiscipline(selectedDisciplineNo);
    setGrants(serverResponse);
  }, [selectedDisciplineNo, serverResponse]);

  useEffect(() => {
    getTop5GrantsByDisciplineNo(discipline).then(setGrants);
  }, [discipline]);

  return (
    <Card>
      <CardHeader className="flex-row justify-between space-y-0">
        <div>
          <CardTitle>Top 5 Grants By Discipline</CardTitle>
          <CardDescription>
            Top 5 grants by discipline from 1975 to 2023
          </CardDescription>
        </div>
        <Select
          value={discipline + ""}
          onValueChange={(e) => setDiscipline(+e)}
        >
          <SelectTrigger className="min-w-60 max-w-fit">
            <SelectValue placeholder="Choose discipline" />
          </SelectTrigger>
          <SelectContent>
            {disciplines.map(({ MainDiscipline, MainDisciplineNumber }) => (
              <SelectItem
                key={MainDisciplineNumber}
                value={MainDisciplineNumber + ""}
              >
                {MainDiscipline}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-auto">
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead>Grant</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Start-end dates</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Institute</TableHead>
                <TableHead>Institute Country</TableHead>
                <TableHead>Researchers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grants.map((grant) => {
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
                  <TableRow key={grant.GrantNumber} className="*:align-top">
                    <TableCell>
                      <Link
                        href={`/grant-detail/${grant.GrantNumber}`}
                        className="inline-flex gap-1"
                      >
                        {grant.GrantNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{grant.Title}</TableCell>
                    <TableCell>
                      {grant.GrantStartDate} - {grant.GrantEndDate}
                    </TableCell>
                    <TableCell className="text-right">
                      {shortenNumber(grant.AmountGrantedAllSets)}
                    </TableCell>
                    <TableCell>
                      {grant.Institute ? (
                        <span>
                          {grant.Institute} ({grant.InstituteCountry})
                        </span>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>{grant.InstituteCountry}</TableCell>
                    <TableCell>{researchers}</TableCell>
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
