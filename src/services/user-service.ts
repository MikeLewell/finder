import { catchError, Observable, of, switchMap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { IUser } from "../models/session";

const useUser = () => {
  // TODO type
  const createUser = (user: any) => {
    return fromFetch(`${process.env.REACT_APP_API}/user`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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

  // TODO type
  const updateUser = (user: any) => {
    return fromFetch(`${process.env.REACT_APP_API}/user/${user.id}`, {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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

  const getUser = (userId: any): Observable<IUser> => {
    return fromFetch(`${process.env.REACT_APP_API}/user/${userId}`, {
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

  return { getUser, createUser, updateUser };
};

export { useUser };
