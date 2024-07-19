import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Observable } from "rxjs";
import { switchMap, tap, throttleTime } from "rxjs/operators";
import { ISession, IUser } from "../../models/session";
import { useSession } from "../../services/session-service";
import Compass from "./map-display/compass";
import MapDisplay from "./map-display/map-display";
import { useGeolocation } from "../../services/geolocation-service";
import { useUser } from "../../services/user-service";

const Session: React.FC = () => {
  const { position$, watchPosition } = useGeolocation();
  const { session$, connectToSocketRoom } = useSession();
  const { getUser, updateUser } = useUser();
  const { sessionId, userId } = useParams<Record<string, string>>();
  const [session, setSession] = useState<ISession>();
  const [user, setUser] = useState<IUser>();
  const [userPosition, setUserPosition] = useState<GeolocationPosition>();
  const [trackingTarget, setTrackingTarget] = useState<IUser>();

  useEffect(() => {
    console.log("triggered");
    connectToSocketRoom(sessionId);
    getSessionUpdates().subscribe();
    updateUserCoords().subscribe();
    getLocalUserPostionUpdates().subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) return;
    getUser(userId)
      .pipe(
        tap((data) => {
          console.log("user received", data);
          setUser(data);
        })
      )
      .subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getSessionUpdates = (): Observable<ISession> => {
    return session$.pipe(
      tap((session) => {
        console.log("session", session);
        setSession(session);

        // TODO is this redundant ?
        setUser(session.users?.find((u) => u.id === userId));

        if (trackingTarget)
          setTrackingTarget(
            session.users?.find((u) => u.id === trackingTarget.id)
          );
      })
    );
  };

  const updateUserCoords = (): Observable<GeolocationPosition> => {
    watchPosition();

    return position$.pipe(
      throttleTime(7000),
      switchMap((position) => {
        console.log(user);
        return updateUser({
          id: userId,
          sessionId: sessionId,
          coords: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          },
        });
      })
    );
  };

  const getLocalUserPostionUpdates = (): Observable<GeolocationPosition> => {
    return position$.pipe(
      tap((pos) => {
        setUserPosition(pos);
      })
    );
  };

  const handleSetTrackingTarget = (id: string): void => {
    const user = session?.users?.find((u) => u.id === id);
    setTrackingTarget(user);
  };

  return (
    <div style={{ height: "100vh" }} className="flex flex--column">
      <div style={{ display: "flex", height: "60vh", position: "relative" }}>
        <span
          style={{ position: "absolute", width: "100%", zIndex: 10 }}
          className="flex flex--align-center flex--justify-center"
        >
          <span className="session-identifier">
            Session ID:{" "}
            <span className="session-identifier__code">{session?.id}</span>
          </span>
        </span>

        {user && <MapDisplay user={user} users={session?.users} />}
      </div>

      <div
        style={{
          paddingTop: "20px",
          borderTopRightRadius: "35px",
          borderTopLeftRadius: "35px",
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: "rgb(40, 45, 67)",
          boxShadow: "0px -1px 10px #717171",
          height: "45vh",
        }}
        className="container flex flex--column"
      >
        <select
          style={{ fontWeight: 600, border: 0 }}
          onChange={(e) => handleSetTrackingTarget(e.target.value)}
          value={trackingTarget?.id}
          className="input input--center-text"
        >
          <option defaultValue="true">Who would you like to find?</option>
          {session?.users
            ?.filter((u) => u.id !== userId)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
        </select>

        {userPosition && (
          <Compass
            userPosition={userPosition}
            trackingTarget={trackingTarget}
          ></Compass>
        )}
      </div>
    </div>
  );
};

export default Session;
