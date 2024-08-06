import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/home";
import Session from "./views/session";
import NotFoundPage from "./views/not-found";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/finder" element={<Home />} />
        <Route
          path="/finder/session/:sessionId/:userId"
          element={<Session />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
