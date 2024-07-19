import { Subject } from "rxjs";

const useGeolocation = () => {
  const position$ = new Subject<GeolocationPosition>();

  const getFirstPosition = (): Promise<GeolocationPosition> => {
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
  };

  const watchPosition = (): void => {
    navigator.geolocation.watchPosition(
      (pos) => {
        console.log(pos);
        position$.next(pos);
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
  };

  return { position$, getFirstPosition, watchPosition };
};

export { useGeolocation };
