import { getGreatCircleBearing } from "geolib";
import { useState } from "react";
import { IUser } from "../../models/user";

interface IProps {
  userPosition: GeolocationPosition;
  trackingTarget: IUser | undefined;
}

const Compass: React.FC<IProps> = ({ userPosition, trackingTarget }) => {
  const [bearingOffset, setBearingOffset] = useState<number>();

  const getTargetBearingOffset = (): number | null => {
    if (userPosition.coords.heading === null || !trackingTarget) return null;

    const targetBearing = getGreatCircleBearing(
      {
        longitude: userPosition.coords.longitude,
        latitude: userPosition.coords.latitude,
      },
      trackingTarget.coords
    );

    let adjustedBearing =
      (targetBearing - userPosition.coords.heading + 360) % 360;

    return adjustedBearing;
  };

  if (userPosition?.coords.heading && trackingTarget) {
    const bearingOffset = getTargetBearingOffset();

    if (bearingOffset) setBearingOffset(bearingOffset);
  }

  return (
    <div className="compass">
      <div
        className="compass__arrow-container"
        style={{
          transform: `rotate(${bearingOffset}deg)`,
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ transform: "scale(4)" }}
        >
          north
        </span>
      </div>
    </div>
  );
};

export default Compass;
