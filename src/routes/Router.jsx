import { Route, Routes } from "react-router-dom";
import Listings from "../components/views/Listings";
import SingleListing from "../components/SingleListing";
import { useEffect } from "react";

function ScrollToTop() {
  useEffect(() => {
    console.log("scrolling to top");
    window.scrollTo(0, 0);
  }, []);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<SingleListing />} />
      </Routes>
    </>
  );
}

export default Router;
