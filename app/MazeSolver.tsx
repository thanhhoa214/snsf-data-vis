"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrickWall, CircleDashed } from "lucide-react";
import { useState } from "react";

export default function MazeSolver({
  maze: initialMaze,
}: {
  maze: string[][];
}) {
  const [maze, setMaze] = useState(initialMaze);
  const isolations = findIsolations(maze);
  const { newMaze, removedWalls } = removeWallToFixIsolatedCells({
    maze,
    isolations,
  });
  const loops = findLoops(newMaze);
  const { newMaze: newMaze2, removedWalls: removedWalls2 } =
    removeDotToFixLoops({ maze: newMaze, isolations: loops });

  return (
    <li className="p-4 pt-2 border rounded-xl shadow-md bg-yellow-50">
      <h3>Input</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = e.currentTarget.maze.value as string;
          if (!text) return;
          const newMaze = text.split("\n").map((row) => row.trim().split(""));
          setMaze(newMaze);
        }}
      >
        <textarea
          name="maze"
          rows={maze.length}
          className="block mb-2 font-mono"
          defaultValue={maze.map((row) => row.join("")).join("\n")}
        ></textarea>
        <Button size={"sm"}>Submit</Button>
      </form>

      <h3>
        Maze (Isolations: {isolations.length}, Loops: {loops.length})
      </h3>
      <Maze maze={maze} />
      <h3>Isolated cells count: {isolations?.length} </h3>
      <Maze maze={maze} isolations={isolations} />
      <h3>Remove walls to fix isolated</h3>
      <Maze maze={newMaze} removedWalls={removedWalls} />
      <h3>Loops count: {loops.length} </h3>
      <Maze maze={newMaze} isolations={loops} />
      <h3>Remove dots to fix loops</h3>
      <Maze maze={newMaze2} removedWalls={removedWalls2} />
    </li>
  );
}

function Maze({
  maze,
  isolations = [],
  removedWalls = [],
}: {
  maze: string[][];
  isolations?: number[][];
  removedWalls?: number[][];
}) {
  return (
    <div
      className="grid w-fit"
      style={{
        gridTemplateColumns: `repeat(${maze[0].length}, minmax(0, 1fr))`,
      }}
    >
      {maze.map((row, i) =>
        row.map((cell, j) => (
          <span
            key={`${i}${j}`}
            className={cn(
              isolations.some(([ii, jj]) => ii === i && jj === j)
                ? "bg-red-200"
                : "",
              removedWalls.some(([ii, jj]) => ii === i && jj === j)
                ? "bg-green-200"
                : ""
            )}
          >
            {cell === "x" ? <BrickWall fill="#00000060" /> : <CircleDashed />}
          </span>
        ))
      )}
    </div>
  );
}

function findIsolations(maze: string[][]) {
  const newMaze = maze.map((row) => [...row]);

  // Find the starting point
  const start = getStartPoint(newMaze);
  if (!start)
    throw new Error(
      `Invalid maze [${maze[0].length}, ${maze.length}], no starting point found`
    );

  const [i, j] = start;
  const queue = [[i, j]];

  while (queue.length) {
    const [i, j] = queue.shift()!;
    if (newMaze[i][j] === "x") continue;

    newMaze[i][j] = "@";

    // Check if the cell is isolated at 4 directions
    for (const [di, dj] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      const ni = i + di;
      const nj = j + dj;

      if (newMaze[ni]?.[nj] === ".") {
        queue.push([ni, nj]);
      }
    }
  }
  const isolations = newMaze
    .flatMap((row, i) => row.map((cell, j) => [i, j, cell] as const))
    .filter(([, , cell]) => cell === ".")
    .map(([i, j]) => [i, j]);
  return isolations;
}

function getStartPoint(maze: string[][]) {
  // Use for loop to find the first [.] in start/end row or column of the maze
  const firstRow = maze[0];
  if (firstRow.includes(".")) return [0, firstRow.indexOf(".")];
  const lastRow = maze[maze.length - 1];
  if (lastRow.includes(".")) return [maze.length - 1, lastRow.indexOf(".")];
  const firstColumn = maze.map((row) => row[0]);
  if (firstColumn.includes(".")) return [firstColumn.indexOf("."), 0];
  const lastColumn = maze.map((row) => row[row.length - 1]);
  if (lastColumn.includes("."))
    return [lastColumn.indexOf("."), maze.length - 1];
  return null;
}

function removeWallToFixIsolatedCells({
  maze,
  isolations,
}: {
  maze: string[][];
  isolations: number[][];
}) {
  if (!isolations.length) return { newMaze: maze, removedWalls: [] };

  const newMaze = maze.map((row) => [...row]);
  let newIsolatedCells = [...isolations];
  const removedWalls: number[][] = [];

  let cell;
  do {
    cell = newIsolatedCells.shift();
    if (!cell) break;

    const [i, j] = cell;
    for (const [di, dj] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      const boundI = i + di;
      const boundJ = j + dj;
      const boundI2 = i + di * 2;
      const boundJ2 = j + dj * 2;
      // prevent out of bound
      if (boundI2 < 0 || boundJ2 < 0) continue;
      if (boundI2 >= maze.length || boundJ2 >= maze[i].length) continue;

      const isX = newMaze[boundI]?.[boundJ] === "x";
      const thenDot = newMaze[boundI2]?.[boundJ2] === ".";
      if (!isX || !thenDot) continue;

      removedWalls.push([boundI, boundJ]);
      newMaze[boundI][boundJ] = ".";
      const isolations = findIsolations(newMaze);
      if (!isolations.length) return { newMaze, removedWalls };
      newIsolatedCells = isolations;
      break;
    }
  } while (!!cell);

  return { newMaze, removedWalls };
}

function findLoops(maze: string[][]) {
  const revertedMaze = maze.map((row) =>
    row.map((cell) => (cell === "." ? "x" : "."))
  );
  return findIsolations(revertedMaze);
}

function removeDotToFixLoops({
  maze,
  isolations,
}: {
  maze: string[][];
  isolations: number[][];
}) {
  const revertedMaze = maze.map((row) =>
    row.map((cell) => (cell === "." ? "x" : "."))
  );
  const { newMaze, removedWalls } = removeWallToFixIsolatedCells({
    maze: revertedMaze,
    isolations,
  });
  const revertedNewMaze = newMaze.map((row) =>
    row.map((cell) => (cell === "." ? "x" : "."))
  );
  return { newMaze: revertedNewMaze, removedWalls };
}
