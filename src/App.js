import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Mitm from "./components/mitm";
import Bruteforce from "./components/bruteforce";
import Custompage from "./components/custompage";

function MainPage() {
  const [showPredefinedOptions, setShowPredefinedOptions] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <div className="container">
        <h1>Create, Test and Smiulate</h1>
        <h2>all in one place</h2>
        <div>
          <button onClick={() => navigate("/custompage")}>
            Custom Network
          </button>

          <button onClick={() => setShowPredefinedOptions(true)}>
            Predefined Network
          </button>
        </div>

        {showPredefinedOptions && (
          <div>
            <button onClick={() => navigate("/mitm")}>MITM</button>

            <button onClick={() => navigate("/bruteforce")}>Brute Force</button>

            <button
              className="back-button"
              onClick={() => setShowPredefinedOptions(false)}
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/custompage" element={<Custompage />} />
        <Route path="/mitm" element={<Mitm />} />
        <Route path="/bruteforce" element={<Bruteforce />} />
      </Routes>
    </Router>
  );
}

export default App;
