import "./App.scss";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/home/home";
import GeolocationService from "./services/geolocation-service";
import SessionService from "./services/session-service";
import Session from "./components/session/session";
import Header from "./patterns/header";

function App() {
  return (
    <div>
      <Header></Header>
      <div className="page-container">
        <Router>
          <Switch>
            <Route exact path="/">
              <Home
                sessionService={new SessionService()}
                geolocationService={new GeolocationService()}
              />
            </Route>
            <Route path="/session/:sessionId/:userId">
              <Session
                sessionService={new SessionService()}
                geolocationService={new GeolocationService()}
              />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
