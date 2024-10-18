"use client";
import Graph from "graphology";
import { FC, useEffect } from "react";

import { GraphResponse } from "@/app/actions/grantToPersonNetwork";
import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  ZoomControl,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { useLayoutRandom } from "@react-sigma/layout-random";

export interface GraphProps {
  data: GraphResponse;
  onClickPerson?: (person: string) => void;
}

const RandomLayoutGraph = ({ data, onClickPerson }: GraphProps) => {
  const { positions, assign } = useLayoutRandom();
  const loadGraph = useLoadGraph();
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      // node events
      clickNode: (event) => onClickPerson?.(event.node),
    });
  }, [registerEvents, onClickPerson]);

  useEffect(() => {
    const graph = new Graph({ multi: true });
    const nodes = Object.keys(data.nodes);
    nodes.forEach((node) => {
      graph.addNode(node, {
        label: data.nodes[node].label,
        size: 4,
        color: "#000000",
        x: 0,
        y: 0,
      });
    });

    data.edges.forEach(([source, target]) => {
      graph.addEdge(source, target, { size: 1, color: "#00000020" });
    });

    loadGraph(graph);
    assign();
  }, [assign, data.edges, data.nodes, loadGraph, positions]);

  return null;
};

export const LayoutCircular: FC<GraphProps> = ({ data, onClickPerson }) => {
  return (
    <SigmaContainer
      settings={{ allowInvalidContainer: true }}
      className="border rounded-xl w-3/4 aspect-video"
    >
      <RandomLayoutGraph data={data} onClickPerson={onClickPerson} />
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl className="*:!flex *:justify-center *:items-center" />
        <FullScreenControl className="*:!flex *:justify-center *:items-center" />
      </ControlsContainer>
      <ControlsContainer position={"top-right"}>
        <SearchControl className="w-48" />
      </ControlsContainer>
    </SigmaContainer>
  );
};
