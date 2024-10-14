import Navbar from "@/components/ui2/Navbar";
import PersonFilter from "@/components/ui2/PersonFilter";
import { Loader } from "lucide-react";
import { Suspense } from "react";
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
