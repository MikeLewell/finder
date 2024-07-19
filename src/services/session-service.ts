import { Observable, of, Subject } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { catchError, switchMap } from "rxjs/operators";
import { io, Socket } from "socket.io-client";
import { ISession } from "../models/session";

const useSession = () => {
  const session$ = new Subject<ISession>();
  const socket: Socket = io(`${process.env.REACT_APP_API}`);

  socket.on("session", (session: ISession) => {
    console.log("received session", session);
    session$.next(session);
  });

  const createSession = (payload: ISession): Observable<ISession> => {
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
        if (response.ok) {
          return response.json();
        } else {
          return of(new Error(`Error ${response.status}`));
        }
      }),
      catchError((err) => {
        console.error(err);
        return of(err);
      })
    );
  };

  const getSession = (id: string): Observable<ISession> => {
    return fromFetch(`${process.env.REACT_APP_API}/session/${id}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }).pipe(
      switchMap((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return of(new Error(`Error ${response.status}`));
        }
      }),
      catchError((err) => {
        console.error(err);
        return of(err);
      })
    );
  };

  const updateSession = (payload: ISession): Observable<ISession> => {
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
        if (response.ok) {
          return response.json();
        } else {
          return of(new Error(`Error ${response.status}`));
        }
      }),
      catchError((err) => {
        console.error(err);
        return of(err);
      })
    );
  };

  const connectToSocketRoom = (sessionId: string): void => {
    socket.emit("session:join_room", sessionId);
  };

  const socketUpdateSession = (session: ISession): void => {
    socket.emit("session:update", session);
  };

  return {
    session$,
    createSession,
    getSession,
    updateSession,
    connectToSocketRoom,
    socketUpdateSession,
  };
};

export { useSession };
