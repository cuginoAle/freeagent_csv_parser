#!/usr/bin/env node
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  var TransactionDate = d.Date,
      Amount = d.Amount,
      Description = d.Description,
      Name = d.Name,
      rest = _objectWithoutProperties(d, ["Date", "Amount", "Description", "Name"]);

  var line = [getDate(TransactionDate), Amount, (Name || rest['"Payer Name"'] || rest['"Payee Name"'] || rest["Merchant"]) + " - " + Description].join(",").replaceAll('"', "");
  console.log("=> " + line);
  return line;
});
var dataToWrite = filteredData.join("\n");
console.log("Writing csv file...");
console.log("-------------------------");
fs.writeFileSync("parsedCsv_" + fileName, dataToWrite);
console.log("done.");

function getDate(dateStr) {
  if (dateStr.indexOf("-") === -1) return dateStr;

  var _dateStr$split = dateStr.split("-"),
      _dateStr$split2 = _slicedToArray(_dateStr$split, 3),
      d = _dateStr$split2[0],
      m = _dateStr$split2[1],
      y = _dateStr$split2[2];

  return new Date(y, m - 1, d).toLocaleDateString();
}