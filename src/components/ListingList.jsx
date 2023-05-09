import React from "react";
import { useState } from "react";

//import { Link } from "react-router-dom";
const ListingList = ({ listings }) => {
  const [charLimit, setCharLimit] = React.useState(32); // default character limit
  const [showMore, setShowMore] = React.useState(false);

  const toggleShowMore = () => setShowMore(!showMore);


    return (
        <>
        <p>All listings</p>
        <div className="flex flex-wrap justify-center gap-4">
            {listings.map((listing) => (
                <div key={listing.id} className=""> 
                    <div className="inline-flex flex-col items-center min-h-[500px] h-full border border-red-500 py-2 ">
        <img className="inline-flex w-64 h-64 object-cover backdrop-blur-md bg-gray-300 rounded-lg" src={listing.media[0]}/>

        
        <p className="text-sm font-semibold">{listing.name}</p>
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
          <div className=" left-0 relative border-2 border-red-500">
                <label className="rating-label">
                  <span className="text-xs text-gray-500">
                    Rated {listing.rating}/5
                  </span>
                  <input
                    aria-label={`Rating  out of 5`}
                    className="rating h-4"
                    max="5"
                    readOnly
                    step="0.01"
                    style={{ "--fill": "#0097a7", "--value": listing.rating}}// 
                    type="range"
                  />
                </label>  
          </div>
          <p className="w-56 text-xs font-medium max-h-[10em]">
            
  {listing.description.slice(0, charLimit)}
  {listing.description.length > charLimit && !showMore ? "..." : ""}
  
</p>

{showMore && (
  <p className="w-56 p-1 text-xs font-medium">
    {listing.description.slice(charLimit)}
  </p>
)}

{listing.description.length > charLimit ? (
    <div className="p-1 mt-2">
      <button className="border-2 border-red-500 p-1 mt-1 w-56 text-xs font-medium" style={{verticalAlign: 'top'}} onClick={toggleShowMore}>
        {showMore ? "Show less" : "Show more"}
      </button>
    </div>
  ) : null}

                  </div>
                </div>
            ))}
            </div>

        </>
    );
};

export default ListingList;