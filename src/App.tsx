import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/home";
import Session from "./views/session";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/finder" element={<Home />} />
        <Route
          path="/finder/session/:sessionId/:userId"
          element={<Session />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
