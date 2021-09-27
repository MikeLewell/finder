import React, { useState } from "react";
import { tap } from "rxjs/operators";
import { useHistory } from "react-router-dom";

import Button from "../../patterns/button";
import Input from "../../patterns/input";
import GeolocationService from "../../services/geolocation-service";
import SessionService from "../../services/session-service";

interface IProps {
  geolocationService: GeolocationService;
  sessionService: SessionService;
}

const Home = ({ geolocationService, sessionService }: IProps) => {
  const [creatorUserName, setCreatorUserName] = useState<string>("");
  const [joiningUserName, setJoiningUserName] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const history = useHistory();

  const createSession = async (): Promise<void> => {
    const position = await geolocationService.getIntialPosition();
    const { longitude, latitude } = position.coords;

    sessionService
      .createSession({
        name: creatorUserName,
        coords: {
          longitude,
          latitude,
        },
      })
      .pipe(
        tap({
          next: (res) =>
            history.push(`/session/${res.sessionId}/${res.userId}`),
          error: () => alert("Something went wrong"),
        })
      )
      .subscribe();
  };

  const joinSession = async (): Promise<void> => {
    const position = await geolocationService.getIntialPosition();
    const { longitude, latitude } = position.coords;

    sessionService
      .joinSession({
        name: joiningUserName,
        coords: {
          longitude,
          latitude,
        },
        sessionId: sessionId,
      })
      .pipe(
        tap({
          next: (res) =>
            history.push(`/session/${res.sessionId}/${res.userId}`),
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
