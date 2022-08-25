const path = require("path");
const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.static(path.join(__dirname)));

app.get("/", (request, response) => {
  var ipAddress = "8.8.8.8";
  var apiKey = "at_77y7U90HlC9P5sUxHB0AvgBwKHuX7";
  var domain = "";

  axios
    .get(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}&domain=${domain}`
    )
    .then(function (res) {
      console.log(res);
    })
    .catch(function (res) {
      console.log(error);
    })
    .then(() => {
      response.sendFile(__dirname + "/index.html");
    });
});

app.listen(5500);
