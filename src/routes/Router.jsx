import { Route, Routes } from "react-router-dom";
import Listings from "../components/views/Listings";
import SingleListing from "../components/SingleListing";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<SingleListing />} />
      </Routes>
    </>
  );
}

export default Router;
