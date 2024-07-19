import React, { useState } from "react";
import { switchMap, tap } from "rxjs/operators";
import { useHistory } from "react-router-dom";

import Button from "../../patterns/button";
import Input from "../../patterns/input";
import { useSession } from "../../services/session-service";
import { createId, createShortId } from "../../lib/utilities";
import { useGeolocation } from "../../services/geolocation-service";
import { useUser } from "../../services/user-service";
import Header from "../../patterns/header";

const Home: React.FC = () => {
  const { getFirstPosition } = useGeolocation();
  const { createSession } = useSession();
  const { createUser } = useUser();
  const [creatorUserName, setCreatorUserName] = useState<string>("");
  const [joiningUserName, setJoiningUserName] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const history = useHistory();

  const createNewSession = async (): Promise<void> => {
    const position = await getFirstPosition();
    const { longitude, latitude } = position.coords;
    const session = {
      id: createShortId(),
    };

    createSession(session)
      .pipe(
        switchMap((session) => {
          console.log(session);
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
            console.log("user", user);
            if (user) history.push(`/session/${session.id}/${user.id}`);
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
            if (user) history.push(`/session/${sessionId}/${user.id}`);
          },
          error: () => alert("Something went wrong"),
        })
      )
      .subscribe();
  };

  return (
    <>
      <Header />

      <div className="container flex flex--column flex--spacing-bottom">
        <h1>Create Session</h1>

        <Input
          type={"text"}
          placeholder={"What is your name?"}
          onChange={(e: string) => setCreatorUserName(e)}
        ></Input>

        <Button
          buttonText={"Go!"}
          disabled={!creatorUserName}
          onClick={() => createNewSession()}
        ></Button>

        <hr style={{ width: "100%" }} />

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
    </>
  );
};

export default Home;
