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
    </main>
  );
}
