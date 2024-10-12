import { Button } from "@/components/ui/button";
import PersonFilter from "@/components/ui2/PersonFilter";
import { prisma } from "@/lib/prisma/client";
import { searchInstitutes } from "../actions/institute";

export default async function InstituteFilter({
  InstituteNumber,
}: {
  InstituteNumber: number;
}) {
  const institutes = await searchInstitutes();
  const initPerson = await prisma.institute.findFirst({
    where: InstituteNumber ? { InstituteNumber } : {},
  });

  return (
    <form method={"GET"} className="flex gap-4 items-center">
      <label>Choose institute:</label>
      <PersonFilter
        serverItems={institutes}
        initItem={initPerson}
        itemKey="InstituteNumber"
        itemLabel="Institute"
        onSearch={searchInstitutes}
      />
      <Button size={"sm"} type="submit">
        Submit
      </Button>
    </form>
  );
}
