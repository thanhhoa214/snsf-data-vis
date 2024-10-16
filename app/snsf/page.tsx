import Navbar from "@/components/ui2/Navbar";
import { shortenNumber } from "@/lib/utils";
import dynamic from "next/dynamic";
import { searchGrant } from "../actions/grant";
import { getGrantToPersonNetwork } from "../actions/grantToPersonNetwork";
import { searchPerson } from "../actions/persons";
import { getStatistics } from "../actions/snsf";
import { NetworkGraphFilterProps } from "./NetworkGraphFilter";
import Top10FundedCountries from "./Top10FundedCountries";
import Top10FundedDisciplines from "./Top10FundedDisciplines";
import Top5GrantMostAward from "./Top5GrantMostAward";

const DynamicNetworkGraphSection = dynamic(
  () => import("./NetworkGraphSection"),
  { ssr: false }
);

export default async function Page() {
  const results = await Promise.all([searchGrant(), searchPerson()]);
  const filterResponse = {
    grants: results[0] as NetworkGraphFilterProps["response"]["grants"],
    persons: results[1] as NetworkGraphFilterProps["response"]["persons"],
  };
  const [
    totalFundedGrants,
    totalFundedAmount,
    totalAwards,
    totalInstitutes,
    totalDisciplines,
    totalResearchers,
  ] = await getStatistics();

  const data = [
    { title: "Total Grants", value: shortenNumber(totalFundedGrants) },
    {
      title: "Total Amount",
      value: shortenNumber(totalFundedAmount._sum.AmountGrantedAllSets || 0),
    },
    { title: "Total Awards", value: shortenNumber(totalAwards) },
    { title: "Total Institutes", value: shortenNumber(totalInstitutes) },
    { title: "Total Disciplines", value: shortenNumber(totalDisciplines) },
    { title: "Total Researchers", value: shortenNumber(totalResearchers) },
  ];

  return (
    <main className="space-y-4">
      <Navbar />
      <h1 className="mb-4 text-center">SNSF Dashboard</h1>

      <ul className="grid gap-4 grid-cols-3 md:grid-cols-6">
        {data.map(({ title, value }) => (
          <li key={title} className="border-r last:border-r-0">
            <p className="text-muted-foreground">{title}</p>
            <strong className="text-2xl">{value}</strong>
          </li>
        ))}
      </ul>

      <DynamicNetworkGraphSection
        graphResponse={await getGrantToPersonNetwork()}
        filterResponse={filterResponse}
      />
      <div className="flex items-start gap-4 *:w-1/2">
        <Top5GrantMostAward />
        <div className="space-y-4">
          <Top10FundedCountries />
          <Top10FundedDisciplines />
        </div>
      </div>
    </main>
  );
}
