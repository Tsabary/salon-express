export function calcGeoDistance(post, cb) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) => {
          
          cb(
            calcDistance(
              lat,
              lng,
              post._geoloc.lat,
              post._geoloc.lng,
              "K"
            ).toFixed(1)
          );
        }
      );
    } else {
      cb(0);
    }
  }