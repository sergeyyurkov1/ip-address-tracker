var ipAddress = "8.8.8.8";
var apiKey = "at_77y7U90HlC9P5sUxHB0AvgBwKHuX7";
var domain = "";

var f = function () {
  fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}&domain=${domain}`
    // { mode: "no-cors" }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

f();
