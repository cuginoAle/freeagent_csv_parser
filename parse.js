#!/usr/bin/env node
const fs = require('fs');
const { exit } = require('process');
const parser = require('./csvToJson')

console.clear();

const filePath = process.argv[2];
if(!filePath) {
  console.log("Syntax: csv  <file_name>")
  exit(1)
}
const data = parser(filePath)
const fileName = filePath.split("/").pop()

if(!data) {
  exit(1)
}
const filteredData = data.map((d)=>{
  const {Date, Amount, Name, Description} = d;
  const line = [Date, Amount, Name + ' - ' + Description].join(',')
  console.log('=> ' + line)
  return line
})

const dataToWrite = filteredData.join("\n")

console.log("Writing csv file...")
console.log("-------------------------")
console.log('done.')


fs.writeFileSync("parsedCsv_" + fileName, dataToWrite)