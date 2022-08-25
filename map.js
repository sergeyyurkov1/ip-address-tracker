var center = [55.751574, 37.573856];

let offset = 150;
function setMapOffset(map) {
  var pixelCenter = map.getGlobalPixelCenter(center);
  pixelCenter = [pixelCenter[0], pixelCenter[1] - offset];
  var newCenter = map.options
    .get("projection")
    .fromGlobalPixels(pixelCenter, map.getZoom());

  map.setCenter(newCenter);
}

ymaps.ready(function () {
  var myMap = new ymaps.Map(
      "map",
      {
        center: center,
        zoom: 9,
        controls: [],
      },
      {
        searchControlProvider: "yandex#search",
        suppressMapOpenBlock: true,
      }
    ),
    myPlacemark = new ymaps.Placemark(
      myMap.getCenter(),
      {
        hintContent: "Собственный значок метки",
        balloonContent: "Это красивая метка",
      },
      {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: "default#image",
        // Своё изображение иконки метки.
        iconImageHref: "./images/icon-location.svg",
      }
    );

  myMap.geoObjects.add(myPlacemark);

  setMapOffset(myMap);
});
