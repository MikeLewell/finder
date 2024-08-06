import React, { useEffect, useState } from "react";
import { switchMap, tap } from "rxjs/operators";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSession } from "../services/session";
import { useGeolocation } from "../services/geolocation";
import { useUser } from "../services/user";
import Header from "../patterns/header";
import Loader from "../patterns/loader";
import Button from "../patterns/button";
import Input from "../patterns/input";

// TODO do we need this ?
// export interface IQuery {
//   filters: Record<string, any>;
//   include: string[];
//   sort: string[];
//   fields: string[];
//   page: number;
//   perPage: number;
// }

const Home: React.FC = () => {
  const { getFirstPosition, isLoading: isLocationLoading } = useGeolocation();
  const { createSession, isLoading: isSessionLoading } = useSession();
  const { createUser, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [creatorUserName, setCreatorUserName] = useState<string>("");
  const [joiningUserName, setJoiningUserName] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const sessionId = searchParams.get("session");

    if (sessionId) setSessionId(sessionId);
  }, [searchParams]);

  const createNewSession = async (): Promise<void> => {
    const position = await getFirstPosition();
    const { longitude, latitude } = position.coords;

    createSession()
      .pipe(
        switchMap((session) => {
          return createUser({
            sessionId: session.id,
            name: creatorUserName,
            coords: {
              longitude,
              latitude,
            },
          });
        }),
        tap({
          next: (user) => {
            if (user) navigate(`/finder/session/${user.sessionId}/${user.id}`);
          },
          error: () => alert("Something went wrong"),
        })
      )
      .subscribe();
  };

  const joinSession = async (): Promise<void> => {
    const position = await getFirstPosition();
    const { longitude, latitude } = position.coords;

    createUser({
      name: joiningUserName,
      sessionId: sessionId,
      coords: {
        longitude,
        latitude,
      },
    })
      .pipe(
        tap({
          next: (user) => {
            if (user) navigate(`/finder/session/${sessionId}/${user.id}`);
          },
          error: () => alert("Something went wrong"),
        })
      )
      .subscribe();
  };

  return (
    <>
      {(isSessionLoading || isUserLoading || isLocationLoading) && <Loader />}

      <Header />

      <div className="container flex flex--column flex--spacing-bottom-medium">
        {!sessionId ? (
          <>
            <h1>Create Session</h1>

            <Input
              type={"text"}
              placeholder={"What is your name?"}
              onChange={(e: string) => setCreatorUserName(e)}
            />

            <Button
              buttonText={"Go!"}
              type="primary"
              disabled={!creatorUserName || isSessionLoading || isUserLoading}
              onClick={() => {
                console.log("i happen");
                createNewSession();
              }}
            />
          </>
        ) : (
          <>
            <h1>Join Session</h1>

            <Input
              type={"text"}
              placeholder={"What is your name?"}
              onChange={(e: string) => setJoiningUserName(e)}
            />

            <Input
              type={"text"}
              value={sessionId}
              placeholder={"Enter a session ID"}
              onChange={(e: string) => setSessionId(e)}
            />

            <Button
              buttonText={"Go!"}
              type="primary"
              disabled={!joiningUserName || isUserLoading}
              onClick={() => joinSession()}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
