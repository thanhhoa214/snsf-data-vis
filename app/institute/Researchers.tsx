import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { prisma } from "@/lib/prisma/client";
import { cn } from "@/lib/utils";
import { startCase } from "lodash-es";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { InstituteByNumber } from "../actions/institute";

export default async function Researchers({
  institute,
}: {
  institute: InstituteByNumber;
}) {
  const researchers = await prisma.person.findMany({
    select: {
      PersonNumber: true,
      FirstName: true,
      Surname: true,
      Gender: true,
      ORCID: true,
      InstitutePlace: true,
    },
    where: { InstituteNumber: institute?.InstituteNumber },
  });

  return (
    <section>
      <h3 className="mb-2">Researchers in this institute</h3>
      <div className="max-h-80 overflow-auto relative">
        <Table>
          <TableCaption className="sr-only">Researchers</TableCaption>
          <TableHeader className="bg-gray-100 sticky top-0 left-0">
            <TableRow>
              <TableHead>PersonNumber</TableHead>
              <TableHead>Surname, first name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>ORCID</TableHead>
              <TableHead>InstitutePlace</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {researchers.map((researcher) => (
              <TableRow key={researcher.PersonNumber}>
                <TableCell className="py-0">
                  {researcher.PersonNumber}
                </TableCell>
                <TableCell className="py-0">
                  <strong>{researcher.Surname}</strong>, {researcher.FirstName}
                </TableCell>
                <TableCell className="py-0">
                  <Tooltip>
                    <TooltipTrigger>
                      <span
                        className={cn(
                          "inline-block w-4 aspect-square rounded-md",
                          researcher.Gender === "male"
                            ? "bg-blue-500"
                            : "bg-red-400"
                        )}
                      ></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{startCase(researcher.Gender)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="py-0">{researcher.ORCID}</TableCell>
                <TableCell className="py-0">
                  {researcher.InstitutePlace}
                </TableCell>
                <TableCell className="py-0">
                  <Link
                    href={`/researcher?PersonNumber=${researcher.PersonNumber}`}
                  >
                    <Button variant={"ghost"} size={"icon"}>
                      <ArrowRight size={20} />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
