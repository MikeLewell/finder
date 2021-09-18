import { Subject } from "rxjs";

export default class GeolocationService {
  currentPostion$ = new Subject<GeolocationPosition>();

  getIntialPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve(pos);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  watchPosition(): Number {
    return navigator.geolocation.watchPosition(
      (pos) => {
        this.currentPostion$.next(pos);
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }
}
