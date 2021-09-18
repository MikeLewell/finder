import { getDistance, getGreatCircleBearing } from "geolib";
import { useEffect, useState } from "react";
import { IUser } from "../../../models/session";

interface IProps {
  userPosition: GeolocationPosition;
  trackingTarget: IUser | undefined;
}

const Compass = ({ userPosition, trackingTarget }: IProps) => {
  const [bearingOffset, setBearingOffset] = useState<number>();
  const [distanceToTarget, setDistanceToTarget] = useState<number>();

  useEffect(() => {
    if (userPosition && trackingTarget) {
      calculateAndSetDistanceToTarget();
    }

    if (userPosition.coords.heading && trackingTarget) {
      calculateAndSetTargetBearingOffset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPosition, trackingTarget]);

  const calculateAndSetDistanceToTarget = (): void => {
    const distance = getDistance(
      {
        longitude: userPosition.coords.longitude,
        latitude: userPosition.coords.latitude,
      },
      //@ts-ignore
      trackingTarget.coords
    );

    setDistanceToTarget(distance);
  };

  const calculateAndSetTargetBearingOffset = (): void => {
    const targetBearing = getGreatCircleBearing(
      {
        longitude: userPosition.coords.longitude,
        latitude: userPosition.coords.latitude,
      },
      //@ts-ignore
      trackingTarget.coords
    );

    const bearingOffset = calculateDegreeOffset(
      userPosition.coords.heading,
      targetBearing
    );

    setBearingOffset(bearingOffset);
  };

  const calculateDegreeOffset = (
    userHeading: number | null,
    targetBearing: number
  ): number => {
    //@ts-ignore
    const bearing = targetBearing - userHeading;

    if (!bearing) {
      return 360 - bearing;
    }

    return bearing;
  };

  return (
    <div className="flex flex--column flex--align-center flex--justify-center flex--spacing-bottom">
      <div className="distance-indicator">
        {distanceToTarget && trackingTarget && (
          <span>
            {distanceToTarget} meters to {trackingTarget.name}
          </span>
        )}
      </div>

      <div className="compass">
        {bearingOffset && (
          <div
            style={{
              transform: `rotate(${bearingOffset}deg)`,
            }}
            className="compass__pointer-container"
          >
            <span className="compass__pointer compass__pointer--target"></span>
          </div>
        )}

        <div className="compass__pointer-container">
          <span className="compass__pointer"></span>
        </div>
        <div className="compass__face"></div>
      </div>
    </div>
  );
};

export default Compass;
