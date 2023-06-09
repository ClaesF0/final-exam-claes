import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import guestIcon from "../assets/guests.svg";
import petsIcon from "../assets/pets.svg";
import parkingIcon from "../assets/parking.svg";
import wifiIcon from "../assets/wifi.svg";
import breakfastIcon from "../assets/breakfast.svg";

const ListingList = ({ listings }) => {
  const [charLimit, setCharLimit] = React.useState(60);
  const [showMore, setShowMore] = React.useState(false);

  const toggleShowMore = () => setShowMore(!showMore);

  const [filters, setFilters] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  const handleFilterChange = (filterName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const filteredListings = listings.filter((listing) => {
    return Object.keys(filters).every((filter) => {
      return !filters[filter] || listing.meta[filter];
    });
  });

  return (
    <>
      <div>
        <h1>Filters</h1>
        <label>
          <input
            type="checkbox"
            checked={filters.wifi}
            onChange={() => handleFilterChange("wifi")}
          />
          WiFi
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.parking}
            onChange={() => handleFilterChange("parking")}
          />
          Parking
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.breakfast}
            onChange={() => handleFilterChange("breakfast")}
          />
          Breakfast
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.pets}
            onChange={() => handleFilterChange("pets")}
          />
          Pets
        </label>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="">
            <Link
              to={`/listings/${listing.id}`}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }}
            >
              <div className="inline-flex flex-col items-center min-h-[300px] h-full py-2 rounded-md">
                <img
                  className="inline-flex w-64 h-64 object-cover backdrop-blur-md bg-gray-300 rounded-lg"
                  src={listing.media[0]}
                />

                <p className="text-sm font-semibold">{listing.name}</p>
                <div className="relative w-72 px-4 inline-flex">
                  {listing.meta.parking && (
                    <img
                      className="w-5 h-5 rounded-lg m-1"
                      src={parkingIcon}
                      alt="Parking possibilities"
                    />
                  )}
                  {listing.meta.wifi && (
                    <img
                      className="w-5 h-5 rounded-lg m-1"
                      src={wifiIcon}
                      alt="Wifi access"
                    />
                  )}
                  {listing.meta.pets && (
                    <img
                      className="w-5 h-5 rounded-lg m-1"
                      src={petsIcon}
                      alt="Pet-friendly"
                    />
                  )}
                  {listing.meta.breakfast && (
                    <img
                      className="w-5 h-5 rounded-lg m-1"
                      src={breakfastIcon}
                      alt="Breakfast included"
                    />
                  )}
                  <div className="inline-flex ml-auto">
                    <img
                      className="w-5 h-5 rounded-full m-1"
                      src={guestIcon}
                      alt="Number of guests"
                    />
                    <p className="text-md font-semibold">{listing.maxGuests}</p>
                  </div>
                </div>
                <div className="w-full px-4 flex justify-between">
                  <label className="rating-label py-1 ">
                    <input
                      aria-label={`Rated {listing.rating} out of 5`}
                      className="rating"
                      max="5"
                      readOnly
                      step="0.01"
                      style={{ "--fill": "#0097a7", "--value": listing.rating }} //
                      type="range"
                    />
                  </label>
                  <div className="">
                    <p className="text-xs py-1 "> {listing.price} € / night </p>
                  </div>
                </div>

                <p className="w-64 text-xs font-medium ">
                  {listing.description.slice(0, charLimit)}
                  {listing.description.length > charLimit && !showMore
                    ? "..."
                    : ""}
                </p>

                {showMore && (
                  <p className="w-64 text-xs font-medium">
                    {listing.description.slice(charLimit)}
                  </p>
                )}

                {listing.description.length > charLimit ? (
                  <div className="">
                    <button
                      className="border-2 rounded-md p-1 my-1 border-charcoal w-64 text-xs font-medium"
                      style={{ verticalAlign: "top" }}
                      onClick={toggleShowMore}
                    >
                      {showMore ? "Show less" : "Show more"}
                    </button>
                  </div>
                ) : null}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListingList;
