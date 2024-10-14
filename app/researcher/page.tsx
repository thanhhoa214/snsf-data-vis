import Navbar from "@/components/ui2/Navbar";
import PersonFilter from "@/components/ui2/PersonFilter";
import { Loader } from "lucide-react";
import { Suspense } from "react";
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
        labelTemplate="{Surname}, {FirstName}"
        onSearch={searchPerson}
      />
      <Suspense
        fallback={
          <div className="h-80 w-full flex flex-col justify-center items-center">
            <Loader className="animate-spin" />
            Loading...
          </div>
        }
      >
        <Container />
      </Suspense>
    </main>
  );
}
