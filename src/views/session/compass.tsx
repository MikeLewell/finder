import { getDistance, getGreatCircleBearing } from "geolib";
import { useEffect, useState } from "react";
import { IUser } from "../../models/session";
import arrow from "../../arrow.svg";

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

    if (userPosition?.coords.heading && trackingTarget) {
      setTargetBearingOffset();
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

  const setTargetBearingOffset = (): void => {
    const targetBearing = getGreatCircleBearing(
      {
        longitude: userPosition.coords.longitude,
        latitude: userPosition.coords.latitude,
      },
      //@ts-ignore
      trackingTarget.coords
    );

    const bearingOffset = getTargetOffsetFromUserHeading(
      userPosition.coords.heading,
      targetBearing
    );

    setBearingOffset(bearingOffset);
  };

  const getTargetOffsetFromUserHeading = (
    currentHeading: number | null,
    targetBearing: number
  ) => {
    if (currentHeading === null) return;

    let adjustedBearing = (targetBearing - currentHeading + 360) % 360;
    return adjustedBearing;
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
        {/* {bearingOffset && ( */}
        <div
          className="compass__arrow-container"
          style={{
            transform: `rotate(${bearingOffset}deg)`,
          }}
        >
          <img
            className="compass_arrow"
            alt="pointer"
            src={arrow}
            width="115px"
            height="115px"
          />
        </div>
        {/* )} */}

        <div className="compass__pointer-container">
          <span className="compass__pointer"></span>
        </div>
        <div className="compass__face"></div>
      </div>
    </div>
  );
};

export default Compass;
