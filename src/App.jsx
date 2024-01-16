import React from "react";
import { Routes, Route } from "react-router-dom";
import {Navbar, Sidebar} from "./components";
import { CampignDetail, Campign, Home, Profile } from "./pages";

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
        <h1>working</h1>
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/campigns" element={<Campign />} />
          <Route path="/campigns-details/:id" element={<CampignDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
