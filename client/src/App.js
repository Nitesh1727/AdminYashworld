import React, { Suspense } from "react";
import "tailwindcss/tailwind.css";
import { BrowserRouter, useHistory } from "react-router-dom";
import axios from "axios";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Routes, Route as RouteElement } from "react-router-dom";
import Home from "./pages/home";

import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/adminDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <div>
              <p className="text-center py-5">Loading...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            
            
            
          </Routes>
        </Suspense>
      </BrowserRouter>
      
    </>
  );
}

export default App;
