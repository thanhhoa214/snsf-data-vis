import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierEstuaryDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import MazeSolver from "./MazeSolver";

const sampleMazes = [
  `xxxxxxxxxxxxx
x.....x.....x
x.xxx.x.xxx.x
x.x.x.x.x.x.x
x.xxx.x.xxx.x
x.....x.....x
xxxxxxxxxx.xx`,
  `xxxxxxx
  ..x.x.x
  x.xxxxx
  x...x.x
  x.x.xxx
  x.....x
  xxxxxxx`,
];

const mazes = sampleMazes.map((maze) =>
  maze.split("\n").map((row) => row.trim().split(""))
);

export default function page() {
  return (
    <main className="p-8">
      <h1>Check valid maze using Blood fill algorithm in C++</h1>

      <ul className="grid grid-cols-2 gap-4">
        {mazes.map((maze, i) => (
          <MazeSolver key={i} maze={maze} />
        ))}
      </ul>

      <h2>Source Code</h2>
      <h3>TypeScript</h3>

      <SyntaxHighlighter
        language="typescript"
        showLineNumbers
        style={atelierEstuaryDark}
      >
        {`
function main() {
  const isolations = findIsolations(maze);
  const { newMaze, removedWalls } = removeWallToFixIsolatedCells({
    maze,
    isolations,
  });
  const loops = findLoops(newMaze);
  const { newMaze: newMaze2, removedWalls: removedWalls2 } = removeDotToFixLoops({ maze: newMaze, isolations: loops });
}

===============


function findIsolations(maze: string[][]) {
  const newMaze = maze.map((row) => [...row]);

  // Find the starting point
  const start = getStartPoint(newMaze);
  if (!start) throw new Error("Invalid maze, no starting point found");

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
`}
      </SyntaxHighlighter>

      <h3>C++</h3>
      <SyntaxHighlighter
        language="cpp"
        showLineNumbers
        style={atelierEstuaryDark}
      >
        {`
#include <vector>
#include <stdexcept>
#include <queue>
#include <algorithm>

using namespace std;

vector<pair<int, int>> findIsolations(const vector<vector<char>>& maze) {
    vector<vector<char>> newMaze = maze;
    auto start = getStartPoint(newMaze);
    if (!start.has_value()) {
        throw invalid_argument("Invalid maze, no starting point found");
    }

    int i = start->first, j = start->second;
    queue<pair<int, int>> q;
    q.push({i, j});

    while (!q.empty()) {
        auto [i, j] = q.front();
        q.pop();
        if (newMaze[i][j] == 'x') continue;

        newMaze[i][j] = '@';

        for (const auto& [di, dj] : vector<pair<int, int>>{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}) {
            int ni = i + di;
            int nj = j + dj;

            if (ni >= 0 && ni < newMaze.size() && nj >= 0 && nj < newMaze[0].size() && newMaze[ni][nj] == '.') {
                q.push({ni, nj});
            }
        }
    }

    vector<pair<int, int>> isolations;
    for (int row = 0; row < newMaze.size(); ++row) {
        for (int col = 0; col < newMaze[row].size(); ++col) {
            if (newMaze[row][col] == '.') {
                isolations.emplace_back(row, col);
            }
        }
    }
    return isolations;
}

optional<pair<int, int>> getStartPoint(const vector<vector<char>>& maze) {
    const auto& firstRow = maze[0];
    auto it = find(firstRow.begin(), firstRow.end(), '.');
    if (it != firstRow.end()) return {0, static_cast<int>(it - firstRow.begin())};

    const auto& lastRow = maze[maze.size() - 1];
    it = find(lastRow.begin(), lastRow.end(), '.');
    if (it != lastRow.end()) return {static_cast<int>(maze.size() - 1), static_cast<int>(it - lastRow.begin())};

    vector<char> firstColumn(maze.size());
    for (int row = 0; row < maze.size(); ++row) {
        firstColumn[row] = maze[row][0];
    }
    it = find(firstColumn.begin(), firstColumn.end(), '.');
    if (it != firstColumn.end()) return {static_cast<int>(it - firstColumn.begin()), 0};

    vector<char> lastColumn(maze.size());
    for (int row = 0; row < maze.size(); ++row) {
        lastColumn[row] = maze[row][maze[row].size() - 1];
    }
    it = find(lastColumn.begin(), lastColumn.end(), '.');
    if (it != lastColumn.end()) return {static_cast<int>(it - lastColumn.begin()), static_cast<int>(maze.size() - 1)};

    return nullopt;
}

pair<vector<vector<char>>, vector<pair<int, int>>> removeWallToFixIsolatedCells(const vector<vector<char>>& maze, const vector<pair<int, int>>& isolations) {
    if (isolations.empty()) return {maze, {}};

    vector<vector<char>> newMaze = maze;
    vector<pair<int, int>> newIsolatedCells = isolations;
    vector<pair<int, int>> removedWalls;

    while (!newIsolatedCells.empty()) {
        auto cell = newIsolatedCells.front();
        newIsolatedCells.erase(newIsolatedCells.begin());

        int i = cell.first, j = cell.second;
        for (const auto& [di, dj] : vector<pair<int, int>>{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}) {
            int boundI = i + di;
            int boundJ = j + dj;
            int boundI2 = i + di * 2;
            int boundJ2 = j + dj * 2;

            if (boundI2 < 0 || boundJ2 < 0 || boundI2 >= maze.size() || boundJ2 >= maze[i].size()) continue;

            bool isX = newMaze[boundI][boundJ] == 'x';
            bool thenDot = newMaze[boundI2][boundJ2] == '.';
            if (!isX || !thenDot) continue;

            removedWalls.emplace_back(boundI, boundJ);
            newMaze[boundI][boundJ] = '.';
            auto isolations = findIsolations(newMaze);
            if (isolations.empty()) return {newMaze, removedWalls};
            newIsolatedCells = isolations;
            break;
        }
    }

    return {newMaze, removedWalls};
}

vector<pair<int, int>> findLoops(const vector<vector<char>>& maze) {
    vector<vector<char>> revertedMaze = maze;
    for (auto& row : revertedMaze) {
        for (auto& cell : row) {
            cell = (cell == '.') ? 'x' : '.';
        }
    }
    return findIsolations(revertedMaze);
}

pair<vector<vector<char>>, vector<pair<int, int>>> removeDotToFixLoops(const vector<vector<char>>& maze, const vector<pair<int, int>>& isolations) {
    vector<vector<char>> revertedMaze = maze;
    for (auto& row : revertedMaze) {
        for (auto& cell : row) {
            cell = (cell == '.') ? 'x' : '.';
        }
    }
    auto [newMaze, removedWalls] = removeWallToFixIsolatedCells(revertedMaze, isolations);
    vector<vector<char>> revertedNewMaze = newMaze;
    for (auto& row : revertedNewMaze) {
        for (auto& cell : row) {
            cell = (cell == '.') ? 'x' : '.';
        }
    }
    return {revertedNewMaze, removedWalls};
}
    `}
      </SyntaxHighlighter>
    </main>
  );
}
