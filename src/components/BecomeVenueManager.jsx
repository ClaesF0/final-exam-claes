import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BecomeVenueManager = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [averageRevenuePerNight, setAverageRevenuePerNight] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const venueManager = localStorage.getItem("venueManager");
    setIsLoggedIn(!!token);
    setIsVenueManager(venueManager === "true");

    calculateAverageRevenuePerNight(); // Call the function here
  }, []);

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
    <>
      <div className="bg-container">
        <div className="bg-image"></div>
        <div className="CTA-overlay">
          <p className="text-3xl text-charcoal font-bold mx-auto ">
            By hosting, you can make an average revenue of{" "}
            {averageRevenuePerNight} per guest staying a night.
          </p>
        </div>
      </div>

      <div>
        {isLoggedIn ? (
          isVenueManager ? (
            <div>
              <h3>You are signed up as a Venue Manager.</h3>
              <Link to="/makealisting">
                <button className="mx-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  Get started with your listings!
                </button>
              </Link>
            </div>
          ) : (
            <div>
              <button className="mx-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Become a Venue Manager
              </button>
            </div>
          )
        ) : (
          <div className="mx-auto text-center">
            <p className="">
              To become a Venue Manager, pick this option when signing up - or
              return here after login!
            </p>
            <Link to="/login" className="text-primary text-center">
              Log In & Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default BecomeVenueManager;
