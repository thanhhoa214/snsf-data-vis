import { prisma } from "@/lib/prisma/client";

export default async function Page({
  searchParams,
}: {
  searchParams: { institute_no: string };
}) {
  const instituteNo = Number(searchParams.institute_no ?? "0");
  const institute = await prisma.institute.findFirst({
    where: instituteNo ? { InstituteNumber: instituteNo } : {},
  });

  if (!institute) {
    return <main>No institute found</main>;
  }

  return (
    <main>
      <h1 className="mb-4">Institute Dashboard</h1>
      <p>Institute: {institute.Institute}</p>
    </main>
  );
}
