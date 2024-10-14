import Navbar from "@/components/ui2/Navbar";
import PersonFilter from "@/components/ui2/PersonFilter";
import { searchPerson } from "../actions/persons";
import Container from "./Container";

export default async function Page() {
  return (
    <main className="space-y-4">
      <Navbar />
      <h1 className="mb-4 text-center">Researcher Dashboard</h1>

      <PersonFilter
        serverItems={await searchPerson()}
        itemKey="PersonNumber"
        itemLabel="Surname"
        onSearch={searchPerson}
      />
      <Container />
    </main>
  );
}
