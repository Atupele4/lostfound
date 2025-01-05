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
      <TopNavBar />
        {/* <Routes>
          <Route path="/" element={<App />} />
        </Routes> */}
        <div className="p-4" ></div>
        <Routes>
          <Route index element={<App />} />
          <Route path="viewincident/:incidentId" element={<Incident incidentId={3} />} />
          <Route path="myprofile/" element={<UserProfile />} />
          <Route path="postincident/" element={<ItemForm />} />
          <Route path="signup/" element={<Signup />} />
          <Route path="login/" element={<Login />} />

          {/* <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="concerts">
            <Route index element={<ConcertsHome />} />
            <Route path=":city" element={<City />} />
            <Route path="trending" element={<Trending />} />
          </Route> */}
        </Routes>
      </FirebaseProvider>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
