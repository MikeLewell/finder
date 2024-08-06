import { useState } from "react";
import { Subject } from "rxjs";

const useGeolocation = () => {
  const position$ = new Subject<GeolocationPosition>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getFirstPosition = (): Promise<GeolocationPosition> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLoading(false);
          resolve(pos);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          setIsLoading(false);
          reject(err);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const watchPosition = (): void => {
    navigator.geolocation.watchPosition(
      (pos) => {
        position$.next(pos);
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return { isLoading, position$, getFirstPosition, watchPosition };
};

export { useGeolocation };
