import { Route, Routes } from "react-router-dom";
import Listings from "../components/views/Listings";
import SingleListing from "../components/SingleListing";
import { useEffect } from "react";

function Router() {
  return (
    <>
      <Routes onUpdate={() => window.scrollTo(0, 0)}>
        <Route path="/" element={<Listings />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<SingleListing />} />
      </Routes>
    </>
  );
}

export default Router;
