import { Observable, of, Subject } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { catchError, switchMap } from "rxjs/operators";
import { io, Socket } from "socket.io-client";
import { ISession } from "../models/session";

export default class SessionService {
  session$ = new Subject<ISession>();
  socket: Socket;

  constructor() {
    const socket = io(`${process.env.REACT_APP_API_HOST}`);
    socket.on("session", (session: ISession) => {
      this.session$.next(session);
    });

    this.socket = socket;
  }

  createSession(payload: ISession): Observable<ISession> {
    return fromFetch(`${process.env.REACT_APP_API_HOST}/session`, {
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

  getSession(id: string): Observable<ISession> {
    return fromFetch(`${process.env.REACT_APP_API_HOST}/session/${id}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
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

  updateSession(payload: ISession): Observable<ISession> {
    return fromFetch(`${process.env.REACT_APP_API_HOST}/session`, {
      method: "PATCH",
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

  updateSessionViaSocket(session: ISession): void {
    this.socket.emit("session:update", session);
  }
}
