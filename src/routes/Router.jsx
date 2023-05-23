import { Route, Routes } from "react-router-dom";
import Listings from "../components/views/Listings";
import SingleListing from "../components/SingleListing";
import SignupForm from "../components/views/Signup";
import Login from "../components/views/Login";

import { useEffect } from "react";

function Router() {
  return (
    <>
      <Routes onUpdate={() => window.scrollTo(0, 0)}>
        <Route path="/" element={<Listings />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<SingleListing />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
}

export default Router;
