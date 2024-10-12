"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  getGrantToPersonNetwork,
  GraphResponse,
} from "../actions/grantToPersonNetwork";
import { LayoutCircular } from "./NetworkGraph";
import NetworkGraphFilter, {
  NetworkGraphFilterProps,
} from "./NetworkGraphFilter";

export default function NetworkGraphSection({
  graphResponse: serverGraphResponse,
  filterResponse,
}: {
  graphResponse: GraphResponse;
  filterResponse: NetworkGraphFilterProps["response"];
}) {
  const [graphResponse, setGraphResponse] =
    useState<GraphResponse>(serverGraphResponse);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: NetworkGraphFilterProps["onSubmit"] = async (
    grant,
    person
  ) => {
    setIsLoading(true);
    const network = await getGrantToPersonNetwork({
      grantNo: grant,
      personNo: person,
    });

    setGraphResponse(network);
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Granted Researcher Collaboration Network</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <LayoutCircular data={graphResponse} />
          <NetworkGraphFilter
            response={filterResponse}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
