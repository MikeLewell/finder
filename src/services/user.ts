import { catchError, Observable, of, switchMap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { useState } from "react";
import { IUser } from "../models/user";
import { ApiError } from "../lib/error";

const useUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createUser = (user: Omit<IUser, "id">): Observable<IUser> => {
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

  const updateUser = (user: IUser): Observable<IUser> => {
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

  const getUser = (userId: string): Observable<IUser> => {
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

  return { isLoading, getUser, createUser, updateUser };
};

export { useUser };
