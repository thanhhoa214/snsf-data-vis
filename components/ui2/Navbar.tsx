import { cn } from "@/lib/utils";
import { Building2, CircleUserRound, School } from "lucide-react";

export const links = [
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

export default function Navbar() {
  return (
    <nav>
      <ul className="flex justify-center items-center gap-4">
        {links.map(({ label, icon, className }) => (
          <li key={label}>
            <a
              href={`/${label.toLowerCase()}`}
              className={cn(
                "inline-flex justify-center items-center gap-2 p-2 w-40 border rounded-xl",
                className
              )}
            >
              {icon}
              <strong>{label}</strong>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
