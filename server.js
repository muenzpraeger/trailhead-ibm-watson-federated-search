var express = require("express");
var bodyParser = require("body-parser");
var ossInterface = require("./node/ossInterface");
var ossConfiguration = require("./node/ossConfiguration");
var http = require("http");
var https = require("https");
var env = require("node-env-file");

// Load environment variables for localhost
try {
  env(__dirname + "/.env");
} catch (e) {}

var app = express();

var port = process.env.PORT || 5000;
var https_port = process.env.HTTPS_PORT || parseInt(port) + 1;

app.use(bodyParser.json({ limit: "5mb" }));
//app.use('/resources', express.static('resources'));

app.get("/resources/oss.xml", function(req, res) {
  ossConfiguration.processGet(req, res);
});

app.get("/ossInterface", function(req, res) {
  ossInterface.processGet(req, res);
});

// Create an HTTP service
http.createServer(app).listen(port);
console.log("Server listening for HTTP connections on port ", port);

// Create an HTTPS service if the certs are present
try {
  var options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("key-cert.pem")
  };
  https.createServer(options, app).listen(https_port);
  console.log("Server listening for HTTPS connections on port ", https_port);
} catch (e) {
  console.error("Security certs not found, HTTPS not available");
}
