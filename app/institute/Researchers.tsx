import { Button } from "@/components/ui/button";
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
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>Researchers in this institute</CardTitle>
        <CardDescription>All researchers in this institute</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 overflow-auto">
          {researchers.length ? (
            <Table className="text-xs">
              <TableCaption className="sr-only">Researchers</TableCaption>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Surname, first name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Institute Place</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {researchers.map((researcher) => (
                  <TableRow key={researcher.PersonNumber}>
                    <TableCell className="py-0.5">
                      {researcher.PersonNumber}
                    </TableCell>
                    <TableCell className="py-0.5">
                      <strong>{researcher.Surname}</strong>,{" "}
                      {researcher.FirstName}
                    </TableCell>
                    <TableCell className="py-0.5">
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
                    <TableCell className="py-0.5">
                      {researcher.InstitutePlace}
                    </TableCell>
                    <TableCell className="py-0.5">
                      <Link
                        href={`/researcher?PersonNumber=${researcher.PersonNumber}`}
                      >
                        <Button
                          variant={"ghost"}
                          className="h-7 aspect-square p-0"
                        >
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">
              No researchers found in this institute
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
