import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Router from "../routes/Router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const emptySearch = () => {
    setQuery("");
    setResults([]);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length === 0) {
      setResults([]);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        "https://api.noroff.dev/api/v1/holidaze/venues"
      );
      setResults(
        data.filter(
          (listing) =>
            listing.name.toLowerCase().includes(query.toLowerCase()) ||
            listing.description.toLowerCase().includes(query.toLowerCase())
        )
      );
    };
    fetchData();
  }, [query]);

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 mt-3 md:mt-0">
      <input
        type="text"
        placeholder="Search..."
        className="bg-white border-2 border-primary shadow rounded-full w-[360px] lg:w-[500px] h-[48px] px-4 flex-grow"
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button
          onClick={clearQuery}
          alt="clear search"
          className="absolute right-0 bg-secondary border-2 border-charcoal h-[40px] w-[40px] rounded-full mx-4 my-1 active:scale-95 transition duration-150 ease-in-out"
        >
          <FontAwesomeIcon className="h-6 pt-1 text-white" icon={faXmark} />
        </button>
      )}
      {query.length > 0 && (
        <div className="max-h-80 overflow-y-auto">
          {results.map((listing) => (
            <Link to={`/listings/${listing.id}`} onClick={emptySearch}>
              <ul
                className="border rounded-md border-gray-400 mx-auto p-2 m-2 flex-col items-center justify-center bg-white shadow-lg w-[340px] lg:w-[440px] flex-nowrap text-charcoal hover:bg-primary hover:text-white active:bg-secondary active:text-white transition duration-150 ease-in-out "
                key={listing.id}
              >
                <p className="text-lg">{listing.name}</p>
                <span className="inline-flex">
                  <img
                    className="w-auto h-[80px] mr-2"
                    src={listing.media[0]}
                    alt={listing.name}
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: listing.description
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")
                        .replace(
                          new RegExp(query, "gi"),
                          `<span className="text-primary font-extrabold">${query}</span>`
                        ),
                    }}
                  />
                </span>
              </ul>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
