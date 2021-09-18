import { Observable, of, Subject } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { catchError, switchMap } from "rxjs/operators";
import { io, Socket } from "socket.io-client";
import { ICreateSession, IJoinSession, ISession } from "../models/session";

export default class SessionService {
  session$ = new Subject<ISession>();
  socket: Socket;

  constructor() {
    this.socket = io(`${process.env.REACT_APP_API_HOST}`);

    this.socket.on("session", (session: ISession) => {
      this.session$.next(session);
    });
  }

  createSession(
    payload: ICreateSession
  ): Observable<{ sessionId: string; userId: string }> {
    return fromFetch(`${process.env.REACT_APP_API_HOST}/create_session`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
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
  }

  joinSession(
    payload: IJoinSession
  ): Observable<{ sessionId: string; userId: string }> {
    return fromFetch(`${process.env.REACT_APP_API_HOST}/join_session`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
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
  }

  connectToSocketRoom(sessionId: string): void {
    this.socket.emit("session:join_room", sessionId);
  }

  updateSession(session: ISession): void {
    this.socket.emit("session:update", session);
  }
}
