import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const UsersProfile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const venueManager = localStorage.getItem("venueManager");
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const dispatch = useDispatch();
  console.log("venueManager ER HER ", venueManager);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Dispatch the action to update the profile picture with the new URL
    dispatch(updateProfilePicture(newProfilePicture));
    // Clear the input field
    setNewProfilePicture("");
  };

  useEffect(() => {
    // Fetch user's profile data
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          "https://api.noroff.dev/api/v1/holidaze/profiles/" +
            name +
            "?_venues=true&_bookings=true",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setProfile(data);
        setVenues(data.venues);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    // Fetch user's upcoming bookings
    const fetchUserBookings = async () => {
      try {
        // Make an authenticated request to the bookings endpoint
        // and pass the necessary authentication headers or access token
        const response = await fetch(
          "https://api.noroff.dev/api/v1/holidaze/profiles/" +
            name +
            "/bookings",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    };

    // Fetch user profile and bookings on component mount
    fetchUserProfile();
    fetchUserBookings();
  }, []);

  const handleBecomeVenueManager = async () => {
    try {
      // Make a POST request to update the venueManager value
      const response = await fetch(
        "https://api.noroff.dev/api/v1/holidaze/profiles/" + name,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            venueManager: true,
          }),
        }
      );

      // Check if the request was successful
      if (response.ok) {
        // Update the profile state with the new venueManager value
        setProfile((prevProfile) => ({
          ...prevProfile,
          venueManager: true,
        }));
      } else {
        console.error("Failed to become Venue Manager");
      }
    } catch (error) {
      console.error("Error becoming Venue Manager:", error);
    }
  };

  const updateProfilePicture = async (imageUrl) => {
    console.log("imageUrl ", imageUrl);
    try {
      // Make a PUT request to update the profile picture URL
      const response = await fetch(
        "https://api.noroff.dev/api/v1/holidaze/profiles/" + name,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: "",
            password: "",
            email: "",
            avatar: imageUrl,
            venueManager: venueManager === "true",
          }),
        }
      );

      // Check if the request was successful
      if (response.ok) {
        alert("Profile picture updated successfully");
        localStorage.setItem("avatar", imageUrl); // Update the avatar in localStorage
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar: imageUrl, // Update the avatar in the profile state
        }));
      } else {
        alert("Failed to update profile picture");
        console.error("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };
  console.log("profile ER HER ", profile);
  console.log("bookings ER HER ", bookings);
  return (
    <div className="w-full sm:w-4/5 mx-auto px-2 ">
      {profile && (
        <div>
          <h2>Profile Information</h2>
          <img src={profile.avatar} alt="Avatar" />
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={newProfilePicture}
              onChange={(e) => setNewProfilePicture(e.target.value)}
              placeholder="Enter image URL"
              className="block w-full rounded-md border-0 my-2 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 max-w-[600px]"
            />
            <button
              type="submit"
              className="mx-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Update Profile Picture
            </button>
          </form>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          {profile.venueManager ? (
            <p>Registered as Venue Manager</p>
          ) : (
            <button onClick={handleBecomeVenueManager}>
              Become Venue Manager?
            </button>
          )}
        </div>
      )}

      {bookings.length > 0 && (
        <div>
          <p className="text-charcoal text-lg font-semibold">
            {bookings.length} Upcoming Bookings:
          </p>
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id}>
                <p>Date From: {booking.dateFrom}</p>
                <p>Date To: {booking.dateTo}</p>
                <p>Guests: {booking.guests}</p>
                {/* Additional booking details */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {venues.length > 0 && (
        <div>
          <p className="text-charcoal text-lg font-semibold">
            Your {venues.length} Venues:
          </p>
          <ul>
            {venues.map((venue) => (
              <li key={venue.id}>
                <Link to={`/listings/${venue.id}`}>
                  <div className="border-2 border-primary my-2">
                    <p>Name: {venue.name}</p>
                    <p>Email: {venue.email}</p>
                    <p>Address: {venue.address}</p>
                    <p>Price: {venue.price}</p>
                    <p>Max Guests: {venue.maxGuests}</p>
                    <Link to={`/editlisting/${venue.id}`}>
                      <button
                        type=""
                        className="mx-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Edit Listing
                      </button>
                    </Link>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UsersProfile;
