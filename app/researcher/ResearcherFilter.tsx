import { Button } from "@/components/ui/button";
import PersonFilter from "@/components/ui2/PersonFilter";
import { prisma } from "@/lib/prisma/client";
import { searchPerson } from "../actions/persons";

export default async function ResearcherFilter({
  personNo,
}: {
  personNo: number;
}) {
  const persons = await searchPerson();
  const initPerson = await prisma.person.findFirst({
    where: personNo ? { PersonNumber: personNo } : {},
  });

  return (
    <form method={"GET"} className="flex gap-4 items-center">
      <label>Choose researcher:</label>
      <PersonFilter
        serverItems={persons}
        initItem={initPerson}
        itemKey="PersonNumber"
        itemLabel={"Surname"}
        onSearch={searchPerson}
      />
      <Button size={"sm"} type="submit">
        Submit
      </Button>
    </form>
  );
}
