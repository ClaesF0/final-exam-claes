import { Route, Routes } from "react-router-dom";
import Listings from "../components/views/Listings";


function Router() {
    return (
      <>
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/listings" element={<Listings />} />
        </Routes>
      </>
    );
  }
  
  export default Router;
  