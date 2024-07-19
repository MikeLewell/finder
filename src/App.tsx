import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/home/home";
import Session from "./components/session/session";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/session/:sessionId/:userId">
          <Session />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
