import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BecomeVenueManager = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [averageRevenuePerNight, setAverageRevenuePerNight] = useState(0);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const venueManager = localStorage.getItem("venueManager");
    setIsLoggedIn(!!token);

    // Check if the user is already a venue manager
    setIsVenueManager(venueManager === "true");

    // Calculate the average revenue per night
    calculateAverageRevenuePerNight();
  }, []);

  // Calculate the average revenue per night
  async function calculateAverageRevenuePerNight() {
    try {
      // Make an API call to retrieve all venues
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
        console.log("Successfully fetched venues in BecomeVenueManager");
        const venues = await response.json();

        // Perform the calculation based on the retrieved venues
        let totalMaxGuests = 0;
        let totalPrice = 0;
        let totalPriceWithoutOneStupidListingFor100000000 = 0;

        for (const venue of venues) {
          totalMaxGuests += venue.maxGuests;
          totalPrice += venue.price;
          totalPriceWithoutOneStupidListingFor100000000 =
            totalPrice - 100000000;
        }

        const averageRevenue =
          totalPriceWithoutOneStupidListingFor100000000 / totalMaxGuests;
        console.log("averageRevenue pr guest", averageRevenue);
        setAverageRevenuePerNight(averageRevenue.toFixed()); // Update the state
      } else {
        console.error("Failed to fetch venues");
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  }

  return (
    <>
      <div>
        <BecomeVenueManager averageRevenue={averageRevenuePerNight} />
        <div>
          <p className="text-3xl font-bold text-primary mx-auto text-center">
            By hosting you can make an average revenue of{" "}
            {averageRevenuePerNight} per guest staying a night.
          </p>
        </div>
      </div>
      {isLoggedIn ? (
        // If the user is logged in
        isVenueManager ? (
          // If the user is already a venue manager
          <div>
            <h3>You are signed up a Venue Manager.</h3>
            <Link to="/makealisting">
              <button className="mx-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Get started with your listings!
              </button>
            </Link>
          </div>
        ) : (
          // If the user is not a venue manager
          <div>
            <button className="mx-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Become a Venue Manager
            </button>
          </div>
        )
      ) : (
        // If the user is not logged in
        <div>
          <h3>Please log in to become a Venue Manager.</h3>
          <Link to="/login">Log In</Link>
        </div>
      )}
    </>
  );
};

export default BecomeVenueManager;