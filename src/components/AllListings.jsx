import React from "react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../store/modules/listingsReducer";
import ListingList from "./ListingList";


const listings = () => {
  const dispatch = useDispatch();
  const { listings } = useSelector((state) => state.listingsReducer);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);
  const memoListings = useMemo(() => listings, [listings]);
  return (
    <>
      <p className="text-red-600">LISTINGS</p>
      {<ListingList listings={memoListings} />}
    </>
  );
};

export default listings;
