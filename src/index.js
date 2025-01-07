import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import TopNavBar from "./TopNavBar";
import Incident from "./Incident";
import { BrowserRouter, Routes, Route } from "react-router";
import { FirebaseProvider } from "./FirebaseContext";
import UserProfile from "./myprofile/UserProfile";
import Signup from "./login/Signup ";
import Login from "./login/Login";
import ItemForm from "./ItemForm";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <FirebaseProvider>
        <div className="page-container">
          <TopNavBar />
          <div className="content-wrap">
            <div className="p-4"></div>
            <Routes>
              <Route index element={<App />} />
              <Route
                path="viewincident/:incidentId"
                element={<Incident incidentId={3} />}
              />
              <Route path="myprofile/" element={<UserProfile />} />
              <Route path="postincident/" element={<ItemForm />} />
              <Route path="signup/" element={<Signup />} />
              <Route path="login/" element={<Login />} />
            </Routes>
          </div>
          {/* Footer */}
          <footer className="footer bg-info-subtle text-black text-center py-3">
            <p className="mb-0">
              © 2025 Lostfound Project. All rights reserved. | Built with ❤️ by
              Atupele Mboya. Follow us on{" "}
              <a
                href="https://github.com/Atupele4/lostfound.git"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          </footer>
        </div>
      </FirebaseProvider>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
