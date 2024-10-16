import { links } from "@/components/ui2/Navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
