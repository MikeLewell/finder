import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/home/home";
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
              <Home />
            </Route>
            <Route path="/session/:sessionId/:userId">
              <Session />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
