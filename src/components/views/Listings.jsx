import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../store/modules/listingsReducer";
import ListingList from "../ListingList";
import { Link } from "react-router-dom";
import BecomeVenueManager from "../BecomeVenueManager";

const Listings = () => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listingsReducer.allListings);
  const [averageRevenuePerNight, setAverageRevenuePerNight] = useState(0);
  const isManager = localStorage.getItem("venueManager") == "true";

  useEffect(() => {
    dispatch(fetchListings());
    calculateAverageRevenuePerNight();
  }, [dispatch]);

  async function calculateAverageRevenuePerNight() {
    try {
      const response = await fetch(
        "https://api.noroff.dev/api/v1/holidaze/venues",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const venues = await response.json();

        let totalMaxGuests = 0;
        let totalPrice = 0;
        let totalPriceWithoutOneStupidListingFor100000000 = 0;

        for (const venue of venues) {
          totalMaxGuests += venue.maxGuests;
          totalPrice += venue.price;
          totalPriceWithoutOneStupidListingFor100000000 =
            totalPrice - 100000000;
        }

        //const averageRevenue = totalPrice / totalMaxGuests;
        const averageRevenue =
          totalPriceWithoutOneStupidListingFor100000000 / totalMaxGuests;

        setAverageRevenuePerNight(averageRevenue.toFixed());
      } else {
        console.error("Failed to fetch venues");
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  }

  return (
    <div>
      <div className="bg-image w-full flex-grow h-[600px] mt-[-50px] -z-50 ">
        <h1 className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold">
          {" "}
          {isManager ? (
            <Link to={"/makealisting"}>
              <p className="text-white text-lg md:text-4xl font-bold">
                In your area the average revenue per night is{" "}
                {averageRevenuePerNight}. View your listings or make a new one.
              </p>
            </Link>
          ) : (
            <Link to={"/becomevenuemanager"}>
              <p className="text-white text-lg  md:text-4xl font-bold">
                Become a Holidaze host and earn on average{" "}
                {averageRevenuePerNight} per guest per night
              </p>
            </Link>
          )}
        </h1>
      </div>
      {listings && <ListingList listings={listings} />}
    </div>
  );
};

export default Listings;
