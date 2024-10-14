import Navbar from "@/components/ui2/Navbar";
import PersonFilter from "@/components/ui2/PersonFilter";
import { searchInstitutes } from "../actions/institute";
import Container from "./Container";

export default async function Home() {
  return (
    <main className="space-y-4">
      <Navbar />
      <h1 className="mb-4 text-center">Institute Dashboard</h1>
      <PersonFilter
        serverItems={await searchInstitutes()}
        itemKey="InstituteNumber"
        itemLabel="Institute"
        onSearch={searchInstitutes}
      />

      <Container />
    </main>
  );
}
