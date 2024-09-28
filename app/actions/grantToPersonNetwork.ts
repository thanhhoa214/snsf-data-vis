"use server";
import { prisma } from "@/lib/prisma/client";

export interface GraphResponse {
  nodes: Record<string, { id: number; label: string }>;
  edges: number[][];
}

export async function getGrantToPersonNetwork(filter?: {
  grantNo: number | null;
  personNo: number | null;
}): Promise<GraphResponse> {
  const connections = await prisma.grantToPersonNetwork.findMany({
    ...(!filter ? { take: 400 } : {}),
    where: {
      ...(filter?.grantNo ? { GrantNumber: filter.grantNo } : {}),
      ...(filter?.personNo ? { PersonNumber1: filter.personNo } : {}),
    },
    include: {
      Person1: { select: { Surname: true } },
      Person2: { select: { Surname: true } },
    },
  });
  // get unique persons from person1 and person2
  const uniquePersons: GraphResponse["nodes"] = {};

  connections.forEach((c) => {
    uniquePersons[c.PersonNumber1] = {
      id: c.PersonNumber1,
      label: c.Person1.Surname,
    };
    uniquePersons[c.PersonNumber2] = {
      id: c.PersonNumber2,
      label: c.Person2.Surname,
    };
  });
  const edges = connections.map((c) => [c.PersonNumber1, c.PersonNumber2]);
  const edgesStrs = edges.map((e) => e.join("-"));
  const uniqueEdges = Array.from(new Set(edgesStrs));
  const uniqueEdgesArr = uniqueEdges.map((e) => e.split("-").map((n) => +n));

  return {
    nodes: uniquePersons,
    edges: uniqueEdgesArr,
  };
}
