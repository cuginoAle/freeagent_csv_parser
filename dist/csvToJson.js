"use strict";

var fs = require('fs');

module.exports = function (fileName) {
  try {
    var data = fs.readFileSync(fileName, 'utf-8'); // split the contents by new line

    var lines = data.split(/\r?\n/);
    var labels = lines[0].split(',');
    return lines.slice(1).filter(function (line) {
      return !!line;
    }).map(function (line) {
      var entry = {};
      var fields = line.split(',');
      labels.forEach(function (value, i) {
        entry[value] = fields[i];
      });
      return entry;
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('File not found!');
    } else {
      console.error(error);
    }

    return null;
  }
};