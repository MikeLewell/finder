import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Observable } from "rxjs";
import { switchMap, tap, throttleTime } from "rxjs/operators";
import { ISession, IUser } from "../models/session";
import { useSession } from "../services/session";
import Compass from "./session/compass";
import MapDisplay from "./session/map-display";
import { useGeolocation } from "../services/geolocation";
import { useUser } from "../services/user";

const Session: React.FC = () => {
  const { position$, watchPosition } = useGeolocation();
  const { session$, connectToSocketRoom } = useSession();
  const { getUser, updateUser } = useUser();
  const { sessionId, userId } = useParams();
  const [session, setSession] = useState<ISession>();
  const [user, setUser] = useState<IUser>();
  const [userPosition, setUserPosition] = useState<GeolocationPosition>();
  const [trackingTarget, setTrackingTarget] = useState<IUser>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!sessionId) return;

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
          setUser(data);
        })
      )
      .subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getSessionUpdates = (): Observable<ISession> => {
    return session$.pipe(
      tap((session) => {
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
    <>
      <div style={{ height: "100vh" }} className="flex flex--column">
        <div style={{ display: "flex", height: "50vh", position: "relative" }}>
          <span
            style={{ position: "absolute", width: "100%", zIndex: 10 }}
            className="flex flex--align-center flex--justify-center"
          >
            <span className="session-identifier">
              Session ID:{" "}
              <span className="session-identifier__code">{session?.id}</span>
            </span>
          </span>

          {user && (
            <MapDisplay
              user={user}
              users={session?.users}
              trackingTarget={trackingTarget}
            />
          )}
        </div>

        <div
          style={{
            paddingTop: "20px",
            backgroundColor: "rgb(40, 45, 67)",
            height: "50vh",
          }}
          className="container flex flex--column"
        >
          <select
            style={{ fontWeight: 600, border: 0, outline: "none" }}
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

          <div>
            <a
              href={`https://wa.me/?text=Join%20me%20on%20finder:${process.env.REACT_APP_PUBLIC_URL}?session=${sessionId}`}
              target="_blank"
            >
              Share on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <dialog open={isDialogOpen}>
        <button autoFocus>Close</button>
        <p>This modal dialog has a groovy backdrop!</p>
      </dialog>
    </>
  );
};

export default Session;
