import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";

const prisma = new PrismaClient();

const table = "grantToDiscipline";
function toStartCase(str) {
  return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
}

(async () => {
  const results = [];

  // Read and parse the CSV file
  // fs.createReadStream(`Institute.csv`)
  fs.createReadStream(`${toStartCase(table)}.csv`)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      console.log("CSV file successfully processed");

      await prisma[table].createMany({
        data: results.map((d) => ({
          GrantNumber: parseInt(d.GrantNumber),
          DisciplineNumber: parseInt(d.DisciplineNumber),
        })),
        skipDuplicates: true,
      });
      console.log(
        toStartCase(table),
        " seed complete ",
        await prisma[table].count()
      );

      await prisma.$disconnect();
    })
    .on("error", (error) => {
      console.error(error);
    });
})();
