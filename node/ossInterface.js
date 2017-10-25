"use strict";

var request = require("request");
var watson = require("./watsonDiscovery");
var Mustache = require("mustache");
var fs = require("fs");

let mustacheTemplate = "./resources/response.mustache";

exports.processGet = (req, res, number) => {
  watson.runQuery(req.query.q, req.query.byId, function(response, success) {
    if (success) {
      fs.readFile(mustacheTemplate, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          var output = Mustache.render(data.toString(), response);
          res
            .header("content-type", "application/xml")
            .status(200)
            .send(output);
        }
      });
    } else {
      var output = "Error by connecting to Watson!\n\n Code " + response.code + " " + response.error + "\n";
      if (response.code===401) {
        output = output + "\n\nMake sure you're using the correct service credentials from <a href='https://trailhead.salesforce.com/projects/surface-data-from-ibm-watson-discovery-in-salesforce/steps/set-up-a-watson-discovery-plan-on-ibm-bluemix' target='_blank'>unit 1</a>.";
      }
      res.status(200).send(output);
    }
  });
};
