import React from "react";
//import { Link } from "react-router-dom";
const ListingList = ({ listings }) => {
    return (
        <>
        <p>All listings</p>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ">
            {listings.map((listing) => (
                <div key={listing.id} className="border border-gray-500 rounded-md p-4"> 
                    <div className="inline-flex flex-col items-center justify-end w-72 border border-red-500 p-4">
        <div className="inline-flex space-x-14 items-center justify-end w-64 h-2/3 pl-24 pr-3 py-28 bg-gray-300 rounded-lg">
          <p className="w-24 h-2/3 text-xs">Media images</p>
          <img className="w-6 h-full rounded-lg" src="https://via.placeholder.com/24x24" alt="Placeholder Image"/>
        </div>
        <p className=" h-4 text-sm font-semibold">{listing.name}</p>
          <div className="relative w-72 px-4 inline-flex">
            {listing.meta.parking && (
              <img className="w-5 h-5 rounded-lg m-1" src="src/assets/parking.svg" alt="Parking possibilities"/>)}
            {listing.meta.wifi && (
              <img className="w-5 h-5 rounded-lg m-1" src="src/assets/wifi.svg" alt="Wifi access"/>)}
            {listing.meta.pets && (
              <img className="w-5 h-5 rounded-lg m-1" src="src/assets/pets.svg" alt="Pet-friendly"/>)}
            {listing.meta.breakfast && (
              <img className="w-5 h-5 rounded-lg m-1" src="src/assets/breakfast.svg" alt="Breakfast included"/>)}
            <div className="inline-flex ml-auto">
              <img className="w-5 h-5 rounded-full m-1" src="src/assets/guests.svg" alt="Number of guests"/>
              <p className="text-md font-semibold">{listing.maxGuests}</p>
          </div>
        </div>
        <div className="flex items-center mb-2">
                <label className="rating-label mr-2">
                  <span className="text-xs text-gray-500">
                    Rated {listing.rating}/5
                  </span>
                  <input
                    aria-label={`Rating  out of 5`}
                    className="rating w-20 h-4 mx-2"
                    max="5"
                    readOnly
                    step="0.01"
                    style={{ "--fill": "#0097a7", "--value": listing.rating}}// 
                    type="range"
                  />
                </label>
                <p className="text-gray-500 text-xs">
                  listing.reviews.length reviews
                </p>
              </div>
        <div>
          <p className="w-56 h-4 text-xs font-light">Description of venue:</p>
          <p className="w-56 h-4 text-xs font-medium">{listing.description}</p>
          <p className="w-56 h-4 absolute text-xs font-medium">Price of the venue</p>
        </div>
      </div>
                </div>
            ))}
            </div>

        </>
    );
};

export default ListingList;