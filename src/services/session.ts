import { Observable, of, Subject } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { catchError, switchMap } from "rxjs/operators";
import { ISession } from "../models/session";
import Socket from "./socket";
import { useState } from "react";

const useSession = () => {
  const session$ = new Subject<ISession>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  Socket.on("session", (session: ISession) => {
    console.log("received session", session);
    session$.next(session);
  });

  const createSession = (payload: ISession): Observable<ISession> => {
    setIsLoading(true);

    return fromFetch(`${process.env.REACT_APP_API}/session`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).pipe(
      switchMap((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.json();
        } else {
          return of(new Error(`Error ${response.status}`));
        }
      }),
      catchError((err) => {
        setIsLoading(false);
        console.error(err);
        return of(err);
      })
    );
  };

  const getSession = (id: string): Observable<ISession> => {
    setIsLoading(true);

    return fromFetch(`${process.env.REACT_APP_API}/session/${id}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }).pipe(
      switchMap((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.json();
        } else {
          return of(new Error(`Error ${response.status}`));
        }
      }),
      catchError((err) => {
        setIsLoading(false);
        console.error(err);
        return of(err);
      })
    );
  };

  const updateSession = (payload: ISession): Observable<ISession> => {
    setIsLoading(true);

    return fromFetch(`${process.env.REACT_APP_API}/session`, {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).pipe(
      switchMap((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.json();
        } else {
          return of(new Error(`Error ${response.status}`));
        }
      }),
      catchError((err) => {
        setIsLoading(false);
        console.error(err);
        return of(err);
      })
    );
  };

  const connectToSocketRoom = (sessionId: string): void => {
    Socket.emit("session:join_room", sessionId);
  };

  return {
    session$,
    isLoading,
    createSession,
    getSession,
    updateSession,
    connectToSocketRoom,
  };
};

export { useSession };
