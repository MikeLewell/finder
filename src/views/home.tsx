import React, { useEffect, useState } from "react";
import { switchMap, tap } from "rxjs/operators";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "../patterns/button";
import Input from "../patterns/input";
import { useSession } from "../services/session";
import { createId, createShortId } from "../lib/utilities";
import { useGeolocation } from "../services/geolocation";
import { useUser } from "../services/user";
import Header from "../patterns/header";
import Loader from "../patterns/loader";

const Home: React.FC = () => {
  const { getFirstPosition } = useGeolocation();
  const { createSession, isLoading: isSessionLoading } = useSession();
  const { createUser, isLoading: isUserLoading } = useUser();
  const [creatorUserName, setCreatorUserName] = useState<string>("");
  const [joiningUserName, setJoiningUserName] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("isSessionLoading", isSessionLoading);
    console.log("isUserLoading", isUserLoading);
  }, [isSessionLoading, isUserLoading]);

  useEffect(() => {
    const sessionId = searchParams.get("session");

    if (sessionId) setSessionId(sessionId);
  }, [searchParams]);

  const createNewSession = async (): Promise<void> => {
    const position = await getFirstPosition();
    const { longitude, latitude } = position.coords;
    const session = {
      id: createShortId(),
    };

    createSession(session)
      .pipe(
        switchMap((session) => {
          return createUser({
            id: createId(),
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
            if (user) navigate(`/finder/session/${session.id}/${user.id}`);
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
      id: createId(),
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
      {(isSessionLoading || isUserLoading) && <Loader />}

      <Header />

      <div className="container flex flex--column flex--spacing-bottom">
        {!sessionId ? (
          <>
            <h1>Create Session</h1>

            <Input
              type={"text"}
              placeholder={"What is your name?"}
              onChange={(e: string) => setCreatorUserName(e)}
            ></Input>

            <Button
              buttonText={"Go!"}
              disabled={!creatorUserName || isSessionLoading || isUserLoading}
              onClick={() => createNewSession()}
            ></Button>
          </>
        ) : (
          <>
            <h1>Join Session</h1>

            <Input
              type={"text"}
              placeholder={"What is your name?"}
              onChange={(e: string) => setJoiningUserName(e)}
            ></Input>

            <Input
              type={"text"}
              value={sessionId}
              placeholder={"Enter a session ID"}
              onChange={(e: string) => setSessionId(e)}
            ></Input>

            <Button
              buttonText={"Go!"}
              disabled={!joiningUserName || isUserLoading}
              onClick={() => joinSession()}
            ></Button>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
