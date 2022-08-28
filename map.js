const ipAddressEl = document.getElementById("ip-address");
const locationEl = document.getElementById("location");
const utcEl = document.getElementById("utc");
const ispEl = document.getElementById("isp");
const table = document.getElementById("table");
const map = document.getElementById("map");

function getOffsetFromTimezone(timezone, asString = true) {
  var now = moment();
  var thisOffset = now.utcOffset();
  now.tz(timezone);
  var thatOffset = now.utcOffset();

  var offset_hours = (thatOffset - thisOffset) / 60;

  if (asString === true) {
    return offset_hours > 0
      ? `+${offset_hours} hours`
      : `${offset_hours} hours`;
  } else {
    return offset_hours;
  }
}

function setData(data) {
  let contents = JSON.parse(data.contents);

  if (contents.status === "fail") {
    alert("Bad IP or domain. Try a different address.");

    return;
  }

  myMap.setCenter([contents.lat, contents.lon]);
  myMap.setZoom(10);

  let myPlacemark = new ymaps.Placemark(
    myMap.getCenter(),
    {
      hintContent: "",
      balloonContent: "Location of the IP address/domain",
    },
    {
      iconLayout: "default#image",
      iconImageHref: "./images/icon-location.svg",
    }
  );

  myMap.geoObjects.add(myPlacemark);

  ipAddressEl.innerHTML = contents.query;
  locationEl.innerHTML = `${contents.city}, ${
    contents.city !== contents.regionName
      ? contents.regionName
      : contents.country
  }`;
  ispEl.innerHTML = contents.isp;
  utcEl.innerHTML = getOffsetFromTimezone(contents.timezone);

  table.style.display = "flex";

  setMapOffset();
}

async function fetchData(input) {
  try {
    const response = await fetch(
      `https://api.allorigins.win/get?url=http://ip-api.com/json/${input}`,
      {
        // mode: "no-cors",
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(response.status);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

var setMapOffset = function () {
  let t = table.getBoundingClientRect();

  let m = map.getBoundingClientRect();

  let offset = -((m.bottom - t.bottom) / 2 - (m.bottom - m.top) / 2);

  console.warn(offset);

  let pixelCenter = myMap.getGlobalPixelCenter(center);
  pixelCenter = [pixelCenter[0], pixelCenter[1] - offset];
  let newCenter = myMap.options
    .get("projection")
    .fromGlobalPixels(pixelCenter, myMap.getZoom());

  myMap.setCenter(newCenter);
};

document.getElementById("button").addEventListener("click", (e) => {
  e.preventDefault();

  var input = document.getElementById("input").value;

  const promise = fetchData(input);
  promise.then((data) => setData(data));
});

ymaps.ready(() => {
  center = [0, 0];

  myMap = new ymaps.Map(
    "map",
    {
      center: center,
      zoom: 3,
      controls: [],
    },
    {
      searchControlProvider: "", // yandex#search
      suppressMapOpenBlock: true,
    }
  );
});
