import { Observable, of, Subject } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { catchError, switchMap } from "rxjs/operators";
import { ISession } from "../models/session";
import { useState } from "react";
import { Socket, io } from "socket.io-client";
import { ApiError } from "../lib/error";

const socket: Socket = io(`${process.env.REACT_APP_API}`);

const useSession = () => {
  const session$ = new Subject<ISession>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  socket.on("session", (session: ISession) => {
    session$.next(session);
  });

  const connectToSocketRoom = (sessionId: string): void => {
    socket.emit("session:join_room", sessionId);
  };

  const createSession = (): Observable<ISession> => {
    setIsLoading(true);

    return fromFetch(`${process.env.REACT_APP_API}/session`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).pipe(
      switchMap((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.json();
        }
        throw new ApiError(response.statusText, response.status, "");
      }),
      catchError((err) => {
        setIsLoading(false);
        console.error(err);
        throw err;
      })
    );
  };

  const getSession = (
    id: string,
    include: string[] = []
  ): Observable<ISession> => {
    setIsLoading(true);

    return fromFetch(
      `${process.env.REACT_APP_API}/session/${id}?include=${include.join(",")}`,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).pipe(
      switchMap((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.json();
        }
        throw new ApiError(response.statusText, response.status, "");
      }),
      catchError((err) => {
        setIsLoading(false);
        console.error(err);
        throw err;
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
        }
        throw new ApiError(response.statusText, response.status, "");
      }),
      catchError((err) => {
        setIsLoading(false);
        console.error(err);
        throw err;
      })
    );
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
