import { catchError, Observable, of, switchMap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { IUser } from "../models/session";
import { useState } from "react";

const useUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // TODO type
  const createUser = (user: any) => {
    setIsLoading(true);

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

  // TODO type
  const updateUser = (user: any) => {
    setIsLoading(true);
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

  const getUser = (userId: any): Observable<IUser> => {
    setIsLoading(true);
    return fromFetch(`${process.env.REACT_APP_API}/user/${userId}`, {
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

  return { isLoading, getUser, createUser, updateUser };
};

export { useUser };
