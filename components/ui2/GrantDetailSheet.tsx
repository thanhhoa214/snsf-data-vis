import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Grant } from "@prisma/client";
import Link from "next/link";
import React from "react";

interface GrantDetailSheetContentProps {
  grant: Grant & {
    GrantToPersonNetwork: {
      Person1: {
        PersonNumber: number;
        FirstName: string | null;
        Surname: string | null;
      };
    }[];
  };
}

const GrantDetailSheetContent: React.FC<GrantDetailSheetContentProps> = async ({
  grant,
}) => {
  if (!grant) return null;
  const uniqueResearchers = new Set<number>();
  grant.GrantToPersonNetwork.forEach((person) => {
    uniqueResearchers.add(person.Person1.PersonNumber);
  });
  const researchers = Array.from(uniqueResearchers).map((person, i, arr) => {
    const researcher = grant.GrantToPersonNetwork.find(
      (p) => p.Person1.PersonNumber === person
    );
    if (!researcher) return null;
    return (
      <>
        {" "}
        <Link key={person} href={`/researcher?ResearcherNumber=${person}`}>
          {`${researcher.Person1.FirstName || ""} ${
            researcher.Person1.Surname
          }`}
        </Link>
        {i != arr.length - 1 ? "," : ""}
      </>
    );
  });
  return (
    <Table>
      <TableBody>
        {Object.entries(grant).map(([key, value]) => {
          return (
            <TableRow key={key}>
              <TableCell className="font-medium">
                {key === "GrantToPersonNetwork" ? "Researchers" : key}
              </TableCell>
              <TableCell>
                {key === "GrantToPersonNetwork"
                  ? researchers
                  : value !== null
                  ? String(value)
                  : "N/A"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default GrantDetailSheetContent;
