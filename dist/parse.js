#!/usr/bin/env node
"use strict";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"]
});

var fs = require("fs");

var _require = require("process"),
    exit = _require.exit;

var parser = require("./csvToJson");

console.clear();
var filePath = process.argv[2];

if (!filePath) {
  console.log("Syntax: csv  <file_name>");
  exit(1);
}

var data = parser(filePath);
var fileName = filePath.split("/").pop();

if (!data) {
  exit(1);
}

var filteredData = data.map(function (d) {
  var Date = d.Date,
      Amount = d.Amount,
      Description = d.Description,
      Name = d.Name,
      rest = _objectWithoutProperties(d, ["Date", "Amount", "Description", "Name"]);

  var line = [Date, Amount, (Name || rest['"Payer Name"'] || rest['"Payee Name"'] || rest["Merchant"]) + " - " + Description].join(",");
  console.log("=> " + line);
  return line;
});
var dataToWrite = filteredData.join("\n");
console.log("Writing csv file...");
console.log("-------------------------");
fs.writeFileSync("parsedCsv_" + fileName, dataToWrite);
console.log("done.");