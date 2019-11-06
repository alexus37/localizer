require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/geometry/Circle",
  "esri/geometry/geometryEngine",
  "esri/geometry/support/webMercatorUtils",
  "esri/geometry/Point"
], function (
  Map,
  MapView,
  Graphic,
  Circle,
  geometryEngine,
  webMercatorUtils,
  Point
) {
  require(['./localizer.js'], ({ Localizer }) => {
    const TARGET = new Point({
      latitude: 47.392186,
      longitude: 8.512878
    });

    const getDistance = (latitude, longitude) => {
      const current = new Point({ latitude, longitude });

      const distance = geometryEngine.distance(
        webMercatorUtils.geographicToWebMercator(TARGET),
        webMercatorUtils.geographicToWebMercator(current),
        'kilometers'
      );
      console.log(distance);
      return Math.floor(distance);
    };

    const localizer = new Localizer(
      Map,
      MapView,
      Graphic,
      Circle,
      geometryEngine,
      getDistance,
      TARGET,
    );
  });
});