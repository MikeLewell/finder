import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Observable } from "rxjs";
import { tap, throttleTime, withLatestFrom } from "rxjs/operators";
import { ISession, IUser } from "../../models/session";
import GeolocationService from "../../services/geolocation-service";
import SessionService from "../../services/session-service";
import Compass from "./compass/compass";
import MapDisplay from "./map-display/map-display";

interface IProps {
  geolocationService: GeolocationService;
  sessionService: SessionService;
}

const Session = ({ geolocationService, sessionService }: IProps) => {
  const { sessionId, userId } = useParams<Record<string, string>>();
  const [session, setSession] = useState<ISession>();
  const [user, setUser] = useState<IUser>();
  const [userPosition, setUserPosition] = useState<GeolocationPosition>();
  const [trackingTarget, setTrackingTarget] = useState<IUser>();

  useEffect(() => {
    sessionService.connectToSocketRoom(sessionId);

    getSessionUpdates().subscribe();

    updateSessionWithNewUserCoords().subscribe();

    getLocalUserPostionUpdates().subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSessionUpdates = (): Observable<ISession> => {
    return sessionService.session$.pipe(
      tap((session) => {
        setSession(session);

        setUser(session.users.find((u) => u.id === userId));

        if (trackingTarget)
          setTrackingTarget(
            session.users.find((u) => u.id === trackingTarget.id)
          );
      })
    );
  };

  const updateSessionWithNewUserCoords = (): Observable<
    [GeolocationPosition, ISession]
  > => {
    geolocationService.watchPosition();

    return geolocationService.currentPostion$.pipe(
      throttleTime(7000),
      withLatestFrom(sessionService.session$),
      tap(([position, session]) => {
        const sessionWithUpdatedUser = {
          ...session,
          users: session?.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  coords: {
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                  },
                }
              : u
          ),
        };
        sessionService.updateSessionViaSocket(sessionWithUpdatedUser);
      })
    );
  };

  const getLocalUserPostionUpdates = (): Observable<GeolocationPosition> => {
    return geolocationService.currentPostion$.pipe(
      tap((pos) => {
        setUserPosition(pos);
      })
    );
  };

  const handleSetTrackingTarget = (userName: string): void => {
    const user = session?.users.find((u) => u.name === userName);
    setTrackingTarget(user);
  };

  return (
    <div className="flex--column flex--spacing-bottom">
      <span className="flex flex--align-center flex--justify-center">
        <span className="session-identifier">
          Session ID:{" "}
          <span className="session-identifier__code">{session?.id}</span>
        </span>
      </span>

      {session?.users && user && (
        <React.Fragment>
          <MapDisplay user={user} users={session.users}></MapDisplay>

          <select
            onChange={(e) => handleSetTrackingTarget(e.target.value)}
            className="input input--center-text"
          >
            <option defaultValue="true">Who would you like to find?</option>
            {session.users
              .filter((u) => u.id !== userId)
              .map((u) => (
                <option key={u.id}>{u.name}</option>
              ))}
          </select>
        </React.Fragment>
      )}

      {userPosition && (
        <Compass
          userPosition={userPosition}
          trackingTarget={trackingTarget}
        ></Compass>
      )}
    </div>
  );
};

export default Session;
