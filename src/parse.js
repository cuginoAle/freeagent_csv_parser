#!/usr/bin/env node

require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"],
});

const fs = require("fs");
const { exit } = require("process");
const parser = require("./csvToJson");

console.clear();

const filePath = process.argv[2];
if (!filePath) {
  console.log("Syntax: csv  <file_name>");
  exit(1);
}
const data = parser(filePath);
const fileName = filePath.split("/").pop();

if (!data) {
  exit(1);
}
const filteredData = data.map((d) => {
  const { Date: TransactionDate, Amount, Description, Name, ...rest } = d;

  const line = [
    getDate(TransactionDate),
    Amount,
    (Name || rest['"Payer Name"'] || rest['"Payee Name"'] || rest["Merchant"]) +
      " - " +
      Description,
  ].join(",");
  console.log("=> " + line);
  return line;
});

const dataToWrite = filteredData.join("\n");

console.log("Writing csv file...");
console.log("-------------------------");
fs.writeFileSync("parsedCsv_" + fileName, dataToWrite);
console.log("done.");

function getDate(dateStr) {
  if (dateStr.indexOf("-") === -1) return dateStr;
  const [d, m, y] = dateStr.split("-");
  return new Date(y, m - 1, d).toLocaleDateString();
}
