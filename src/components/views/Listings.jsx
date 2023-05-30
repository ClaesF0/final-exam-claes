import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../store/modules/listingsReducer";
import ListingList from "../ListingList";
import { Link } from "react-router-dom";
import BecomeVenueManager from "../BecomeVenueManager";

const Listings = ({ averageRevenue }) => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listingsReducer.allListings);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  return (
    <div>
      <div className="bg-image w-full flex-grow h-[600px] mt-[-100px] -z-50 ">
        <h1 className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold">
          SAMPLE TEXT {averageRevenue}
        </h1>
      </div>
      {listings && <ListingList listings={listings} />}
    </div>
  );
};

export default Listings;
