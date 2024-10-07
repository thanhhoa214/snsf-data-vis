import { cn } from "@/lib/utils";
import { Building2, CircleUserRound, School } from "lucide-react";
import Link from "next/link";

const links = [
  {
    label: "Researcher",
    icon: <CircleUserRound />,
    className: "border-red-200 bg-red-100 hover:bg-red-200",
  },
  {
    label: "Institute",
    icon: <School />,
    className: "border-blue-200 bg-blue-100 hover:bg-blue-200",
  },
  {
    label: "SNSF",
    icon: <Building2 />,
    className: "border-green-200 bg-green-100 hover:bg-green-200",
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center gap-4 justify-center">
      <h1>Choose your dashboard</h1>
      <ul className="flex justify-center items-center gap-8">
        {links.map(({ label, icon, className }) => (
          <li key={label}>
            <Link
              href={`/${label.toLowerCase()}`}
              className={cn(
                "flex flex-col justify-center items-center p-4 w-40 aspect-video border rounded-xl",
                className
              )}
            >
              {icon}
              <strong>{label}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
