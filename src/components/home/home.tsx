import React, { useState } from "react";
import { mergeMap, tap } from "rxjs/operators";
import { useHistory } from "react-router-dom";

import Button from "../../patterns/button";
import Input from "../../patterns/input";
import GeolocationService from "../../services/geolocation-service";
import SessionService from "../../services/session-service";
import { createId, createShortId } from "../../lib/utilities";

const Home: React.FC = () => {
  const geolocationService = new GeolocationService();
  const sessionService = new SessionService();
  const [creatorUserName, setCreatorUserName] = useState<string>("");
  const [joiningUserName, setJoiningUserName] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const history = useHistory();

  const createSession = async (): Promise<void> => {
    const position = await geolocationService.getIntialPosition();
    const { longitude, latitude } = position.coords;
    const session = {
      id: createShortId(),
      users: [
        {
          id: createId(),
          name: creatorUserName,
          coords: {
            longitude,
            latitude,
          },
        },
      ],
    };

    sessionService
      .createSession(session)
      .pipe(
        tap({
          next: (session) => {
            const user = session.users.find(
              (user) => user.name === creatorUserName
            );

            if (session && user)
              history.push(`/session/${session.id}/${user.id}`);
          },
          error: () => alert("Something went wrong"),
        })
      )
      .subscribe();
  };

  const joinSession = async (): Promise<void> => {
    const position = await geolocationService.getIntialPosition();
    const { longitude, latitude } = position.coords;

    await sessionService
      .getSession(sessionId)
      .pipe(
        mergeMap((session) => {
          const updatedSession = {
            ...session,
            users: [
              ...session.users,
              {
                id: createId(),
                name: joiningUserName,
                coords: {
                  longitude,
                  latitude,
                },
              },
            ],
          };

          return sessionService.updateSession(updatedSession);
        })
      )
      .pipe(
        tap({
          next: (session) => {
            const user = session.users.find(
              (user) => user.name === joiningUserName
            );

            if (session && user)
              history.push(`/session/${session.id}/${user.id}`);
          },
          error: () => alert("Something went wrong"),
        })
      )
      .subscribe();
  };

  return (
    <div className="flex flex--column flex--spacing-bottom">
      <h1>Create Session</h1>

      <Input
        type={"text"}
        placeholder={"What is your name?"}
        onChange={(e: string) => setCreatorUserName(e)}
      ></Input>

      <Button
        buttonText={"Go!"}
        disabled={!creatorUserName}
        onClick={() => createSession()}
      ></Button>

      <hr />

      <h1>Join Session</h1>

      <Input
        type={"text"}
        placeholder={"What is your name?"}
        onChange={(e: string) => setJoiningUserName(e)}
      ></Input>

      <Input
        type={"text"}
        placeholder={"Enter a session ID"}
        onChange={(e: string) => setSessionId(e)}
      ></Input>

      <Button
        buttonText={"Go!"}
        disabled={!joiningUserName}
        onClick={() => joinSession()}
      ></Button>
    </div>
  );
};

export default Home;
