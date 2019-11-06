define(function (require, exports, module) {
  function Localizer(
    Map,
    MapView,
    Graphic,
    Circle,
    geometryEngine,
    distanceFunction,
    TARGET) {
    const circleSymbol = {
      "type": "simple-fill",
      "color": [226, 119, 40, 0.05],
      "outline": {
        color: [255, 255, 255],
        width: 1
      }
    };

    const targetSymbol = {
      "type": "simple-fill",
      "color": [126, 19, 240, 0.25],
      "outline": {
        color: [255, 255, 255],
        width: 2
      }
    };

    const markerSymbol = {
      type: "simple-marker",
      style: "x"
    };

    let pointGraphic = null;
    let targetArea = null;
    let targetAreaGraphic = null;
    const rings = [];

    const view = new MapView({
      center: [8.512878, 47.392186],
      container: "viewDiv",
      map: new Map({ basemap: "hybrid" }),
      zoom: 12
    });

    const createRing = (center, radius) => {
      const circleGeometry = new Circle({
        center,
        geodesic: false,
        radius: radius + 1,
        radiusUnit: "kilometers"
      });

      const circleGeometryInner = new Circle({
        center,
        geodesic: false,
        radius: radius,
        radiusUnit: "kilometers"
      });

      const donut = geometryEngine.difference(circleGeometry, circleGeometryInner);

      var circleGraphic = new Graphic({
        "geometry": donut,
        "symbol": circleSymbol
      });

      rings.push(donut);

      view.graphics.add(circleGraphic);
      if (!targetArea) {
        targetArea = donut;
        targetAreaGraphic = new Graphic({
          "geometry": targetArea,
          "symbol": targetSymbol
        });
        view.graphics.add(targetAreaGraphic);
      } else {
        // Removes a graphic from the View
        view.graphics.remove(targetAreaGraphic);
        targetArea = geometryEngine.intersect(targetArea, donut);
        targetAreaGraphic = new Graphic({
          "geometry": targetArea,
          "symbol": targetSymbol
        });
        view.graphics.add(targetAreaGraphic);
      }
      if(pointGraphic) {
        view.graphics.remove(pointGraphic);
      }
      if(TARGET) {
        pointGraphic = new Graphic({
          geometry: TARGET,
          symbol: markerSymbol
        });
      }
      view.graphics.add(pointGraphic);
    }
    const clickHandler = (e) => {
      const radius = distanceFunction(e.mapPoint.latitude, e.mapPoint.longitude);
      createRing(e.mapPoint, radius);
    }

    view.on('click', clickHandler);
  }

  module.exports.Localizer = Localizer;
});