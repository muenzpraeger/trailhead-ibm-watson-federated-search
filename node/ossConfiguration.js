"use strict";

var request = require("request");
var Mustache = require("mustache");
var fs = require("fs");

let mustacheTemplate = "./resources/oss.mustache";

exports.processGet = (req, res, number) => {
  fs.readFile(mustacheTemplate, function(err, data) {
    if (err) throw err;
    var output = Mustache.render(data.toString(), req);
    res
      .header("content-type", "application/xml")
      .status(200)
      .send(output);
  });
};
