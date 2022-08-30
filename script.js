const ipAddressEl = document.getElementById("ip-address");
const locationEl = document.getElementById("location");
const utcEl = document.getElementById("utc");
const ispEl = document.getElementById("isp");
const tableEl = document.getElementById("table");
const mapEl = document.getElementById("map");

const COPYRIGHT = "Sergey Yurkov";

// 1. Create map
ymaps.ready(() => {
  center = [0, 0];

  myMap = new ymaps.Map(
    "map",
    {
      center: center,
      zoom: 3,
      controls: [], // disables control buttons
    },
    {
      suppressMapOpenBlock: true, // disables more control buttons
    }
  );

  placemarkCollection = new ymaps.GeoObjectCollection(null);
  myMap.geoObjects.add(placemarkCollection);

  myMap.copyrights.add(COPYRIGHT); // ©
});

// 2. Main function
document.getElementById("button").addEventListener("click", async (e) => {
  e.preventDefault();

  const input = document.getElementById("input").value;

  const data = await fetchData(input);

  displayData(data);
});

// 3. Functions
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

    const data = await response.json();

    return JSON.parse(data.contents);
  } catch (error) {
    console.error(error);
  }
}

function displayData(data) {
  if (data.status === "fail") {
    alert("Bad IP or domain. Try a different address.");

    return;
  }

  setPlacemark(data);
  updateTable(data);
  setMapOffset();
}

function setPlacemark(data) {
  // Clear existing placemarks
  placemarkCollection.removeAll();

  // Reset map location
  myMap.setCenter([data.lat, data.lon]);
  myMap.setZoom(10);

  const placemark = new ymaps.Placemark(
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

  placemarkCollection.add(placemark);
}

function setMapOffset() {
  const offsetY = getPlacemarkOffset();

  const existingMapCenter = myMap.getGlobalPixelCenter(center);
  const updatedMapCenter = [
    existingMapCenter[0],
    existingMapCenter[1] - offsetY,
  ];

  const newMapCenter = myMap.options
    .get("projection")
    .fromGlobalPixels(updatedMapCenter, myMap.getZoom());

  myMap.setCenter(newMapCenter);
}

function updateTable(data) {
  ipAddressEl.innerHTML = data.query;
  locationEl.innerHTML = `${data.city}, ${
    data.city !== data.regionName ? data.regionName : data.country
  }`;
  ispEl.innerHTML = data.isp;
  utcEl.innerHTML = `${getOffsetFromTimezone(data.timezone)} hours`;

  tableEl.style.display = "flex";
}

function getPlacemarkOffset() {
  let tableXY = tableEl.getBoundingClientRect();

  let mapXY = mapEl.getBoundingClientRect();

  // @TODO: refactor this formula
  return -(
    (mapXY.bottom - tableXY.bottom) / 2 -
    (mapXY.bottom - mapXY.top) / 2
  );
}

function getOffsetFromTimezone(timezone) {
  let now = moment();
  const thisOffsetMinutes = now.utcOffset();
  now.tz(timezone);
  const thatOffsetMinutes = now.utcOffset();

  const offsetHours = (thatOffsetMinutes - thisOffsetMinutes) / 60;

  return offsetHours > 0 ? `+${offsetHours}` : `${offsetHours}`;
}
