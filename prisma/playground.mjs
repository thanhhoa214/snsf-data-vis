import { PrismaClient } from "@prisma/client";
(async () => {
  const prisma = new PrismaClient();
  const grantsByYear = await prisma.$queryRaw`
    SELECT 
      CAST(SUBSTR(GrantStartDate, -4) AS INTEGER) AS year,
      SUM(AmountGrantedAllSets) AS amount
    FROM 
      Grant
    WHERE 
      MainDisciplineNumber = ${30102}
    GROUP BY 
      year
    ORDER BY 
      year ASC;
  `;
  console.log(grantsByYear);
})();
