import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { EMPTY, Observable } from "rxjs";
import { switchMap, tap, throttleTime } from "rxjs/operators";
import { getDistance } from "geolib";
import { IUser } from "../models/user";
import { ISession } from "../models/session";
import { useSession } from "../services/session";
import { useGeolocation } from "../services/geolocation";
import { useUser } from "../services/user";
import Compass from "./session/compass";
import MapDisplay from "./session/map-display";
import Button from "../patterns/button";
import { useNavigate } from "react-router-dom";
import Marker from "../patterns/marker";

const Session: React.FC = () => {
  const { position$, watchPosition } = useGeolocation();
  const { session$, getSession, connectToSocketRoom } = useSession();
  const { getUser, updateUser } = useUser();
  const { sessionId, userId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<ISession>();
  const [user, setUser] = useState<IUser>();
  const [userPosition, setUserPosition] = useState<GeolocationPosition>();
  const [trackingTarget, setTrackingTarget] = useState<IUser>();
  const [distanceToTarget, setDistanceToTarget] = useState<number>();

  useEffect(() => {
    listenForSessionUpdates().subscribe();
    updateUserCoordsPeriodically().subscribe();
    listenForLocalUserPostionUpdates().subscribe();
  }, []);

  useEffect(() => {
    if (sessionId) {
      connectToSocketRoom(sessionId);
      getSession(sessionId, ["user"])
        .pipe(
          tap((session) => {
            setSession(session);
          })
        )
        .subscribe({
          error: (err) => {
            if (err?.httpCode === 404) navigate("/page-not-found");
          },
        });
    }

    if (userId) {
      getUser(userId)
        .pipe(
          tap((data) => {
            setUser(data);
          })
        )
        .subscribe();
    }
  }, [sessionId, userId]);

  useEffect(() => {
    if (userPosition && trackingTarget) {
      const distance = getDistance(
        {
          longitude: userPosition.coords.longitude,
          latitude: userPosition.coords.latitude,
        },
        trackingTarget.coords
      );

      setDistanceToTarget(distance);
    }
  }, [userPosition, trackingTarget]);

  const listenForSessionUpdates = (): Observable<ISession> => {
    return session$.pipe(
      tap((session) => {
        setSession(session);

        if (trackingTarget) {
          setTrackingTarget(
            session.users?.find((u) => u.id === trackingTarget.id)
          );
        } else if (session?.users?.length === 2) {
          setTrackingTarget(session.users.find((u) => u.id !== userId));
        }
      })
    );
  };

  const updateUserCoordsPeriodically = (): Observable<IUser> => {
    watchPosition();

    return position$.pipe(
      throttleTime(7000),
      switchMap((position) => {
        if (user) {
          return updateUser({
            ...user,
            coords: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            },
          });
        } else {
          return EMPTY;
        }
      }),
      tap((user) => {
        setUser(user);
      })
    );
  };

  // TODO this will re-render loads. Make this better.
  const listenForLocalUserPostionUpdates =
    (): Observable<GeolocationPosition> => {
      return position$.pipe(
        tap((pos) => {
          setUserPosition(pos);
        })
      );
    };

  return (
    <div style={{ height: "100vh" }} className="flex flex--column">
      <div style={{ display: "flex", height: "100vh" }}>
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
          backgroundColor: "rgba(40, 45, 67, 20%)",
          height: "40vh",
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
        }}
        className="container flex flex--column flex--align-center"
      >
        <span className="identifier flex flex--spacing-right-small">
          {session?.users?.length && session.users.length > 1 ? (
            <>
              {session?.users
                ?.filter((u) => u.id !== userId)
                .map((u) => (
                  <span onClick={() => setTrackingTarget(u)} key={u.id}>
                    <Marker
                      color={
                        u.id === trackingTarget?.id
                          ? "lightseagreen"
                          : undefined
                      }
                      text={u.name.charAt(0).toUpperCase()}
                    />
                  </span>
                ))}
            </>
          ) : (
            <span
              className="awaiting"
              style={{
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Awaiting lost souls...
            </span>
          )}
        </span>

        <div className="distance-indicator" style={{ minHeight: "50px" }}>
          {distanceToTarget && trackingTarget && (
            <span>
              {distanceToTarget} meters to {trackingTarget.name}
            </span>
          )}
        </div>

        {userPosition && (
          <div
            className="flex flex--align-center flex--justify-center"
            style={{ flexGrow: 1 }}
          >
            <Compass
              userPosition={userPosition}
              trackingTarget={trackingTarget}
            />
          </div>
        )}

        <div
          className="flex flex--justify-space-between"
          style={{ zIndex: 100, width: "100%" }}
        >
          <a
            href={`https://wa.me/?text=Join%20me%20on%20finder:${process.env.REACT_APP_PUBLIC_URL}?session=${sessionId}`}
            target="_blank"
            rel="noreferrer"
            style={{ width: "100%" }}
            className="spacing--right-medium"
          >
            <Button buttonText="WhatsApp" type="secondary" />
          </a>

          <a
            href={`sms:?&body=Join%20me%20on%20finder:${process.env.REACT_APP_PUBLIC_URL}?session=${sessionId}`}
            target="_blank"
            rel="noreferrer"
            style={{ width: "100%" }}
          >
            <Button buttonText="SMS" type="secondary" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Session;
