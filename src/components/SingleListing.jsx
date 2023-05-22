import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { fetchOneListing } from "../store/modules/listingsReducer";
import { Link } from "react-router-dom";
import React from "react";
import {
  faBars,
  faTimes,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import parkingIcon from "../assets/parking.svg";
import wifiIcon from "../assets/wifi.svg";
import petsIcon from "../assets/pets.svg";
import breakfastIcon from "../assets/breakfast.svg";
import guestsIcon from "../assets/guests.svg";

//Calendar-imports
import DatePicker from "react-datepicker";
//import { DatePicker } from "@mui/lab";
import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers";
dayjs.extend(isBetweenPlugin);
//import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";

const SingleListing = () => {
  //CARDS
  const { id } = useParams();
  const dispatch = useDispatch();
  const { listing } = useSelector((state) => state.listingsReducer);
  const [similarListings, setSimilarListings] = useState([]);
  const [charLimit, setCharLimit] = React.useState(60); // default character limit
  const [showMore, setShowMore] = React.useState(false);
  //console.log("id FRA SINGLE LISTING", id);

  const toggleShowMore = () => setShowMore(!showMore);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchOneListing(id));
  }, [dispatch, id]);

  useEffect(() => {
    fetch("https://api.noroff.dev/api/v1/holidaze/venues")
      .then((response) => response.json())
      .then((data) => {
        const filteredListings = data.filter((listing) => {
          //calculate the price difference, and set the min and max price, so the visitor can see similar listings
          const priceDifference = listing.price * 0.1;
          const minPrice = listing.price - priceDifference;
          const maxPrice = listing.price + priceDifference;

          //the same for the maxGuests key
          const maxGuestsDifference = Math.round(listing.maxGuests * 0.1);
          const minGuests = listing.maxGuests - maxGuestsDifference;
          const maxGuests = listing.maxGuests + maxGuestsDifference;

          //check the stuff that would meet the aforementioned conditions
          return (
            listing.id !== id &&
            listing.price >= minPrice &&
            listing.price <= maxPrice &&
            listing.maxGuests >= minGuests &&
            listing.maxGuests <= maxGuests
          );
        });

        setSimilarListings(filteredListings);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [listing]);
  console.log("listing", listing);

  //BOOKING AVAILABLE START
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(
      `https://api.noroff.dev/api/v1/holidaze/venues/${id}?_bookings=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Venue data with bookings:", data);
        const bookingsData = data.bookings;
        setBookings(bookingsData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const dateRanges = bookings.map((booking) => ({
    from: dayjs(booking.dateFrom).toDate(),
    to: dayjs(booking.dateTo).toDate(),
  }));
  console.log("dateRanges", dateRanges);

  const highlightedDates = dateRanges.reduce((accumulator, dateRange) => {
    const { from, to } = dateRange;
    const rangeDates = [];
    let currentDate = dayjs(from);
    while (currentDate.isSame(to, "day") || currentDate.isBefore(to, "day")) {
      rangeDates.push(currentDate.toDate());
      currentDate = currentDate.add(1, "day");
    }
    return [...accumulator, ...rangeDates];
  }, []);

  const [selectedDate, setSelectedDate] = useState(null);

  //  const [bookings, setBookings] = useState([]);
  //
  //  useEffect(() => {
  //    const accessToken = localStorage.getItem("accessToken");
  //    fetch(
  //      `https://api.noroff.dev/api/v1/holidaze/venues/${id}?_bookings=true`,
  //      {
  //        headers: {
  //          Authorization: `Bearer ${accessToken}`,
  //        },
  //      }
  //    )
  //      .then((response) => response.json())
  //      .then((data) => {
  //        console.log("HALLOOO Venue data with bookings:", data);
  //        // Access bookings information from the data object
  //        const bookingsData = data.bookings;
  //        setBookings(bookingsData);
  //      })
  //      .catch((error) => {
  //        console.log(error);
  //      });
  //  }, [id]);

  // Get the date ranges for all bookings
  //const dateRanges = bookings.map((booking) => ({
  //  from: dayjs(booking.dateFrom).toDate(),
  //  to: dayjs(booking.dateTo).toDate(),
  //}));
  //console.log("dateRanges", dateRanges);
  //// Merge the date ranges to highlight them on the calendar
  //const highlightedDates = dateRanges.reduce((accumulator, dateRange) => {
  //  const { from, to } = dateRange;
  //  const rangeDates = [];
  //  let currentDate = dayjs(from);
  //  while (currentDate.isSame(to, "day") || currentDate.isBefore(to, "day")) {
  //    rangeDates.push(currentDate.toDate());
  //    currentDate = currentDate.add(1, "day");
  //  }
  //  return [...accumulator, ...rangeDates];
  //}, []);

  return (
    <>
      <div>
        <div className="container mx-auto flex flex-col md:flex-row px-2 ">
          <div className="w-full md:w-3/4 lg:w-1/2  md:mb-0 mx-auto">
            <img
              className={`max-h-screen object-fit object-center rounded mx-auto mt-1 ${
                selectedImageIndex === 0 ? "" : ""
              }`}
              src={listing.media && listing.media[selectedImageIndex]}
              alt={listing.name}
              onClick={() => setSelectedImageIndex(0)}
            />
            <div className="flex flex-wrap">
              {listing.media &&
                listing.media.map((media, index) => (
                  <img
                    key={index}
                    className={`max-h-[80px] object-fit object-center rounded my-1 mr-1 ${
                      index === 0 ? "opacity-50" : "opacity-50"
                    }`}
                    src={media}
                    alt={listing.name}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
            </div>
          </div>
          <div className="w-full md:w-1/3 block mx-1">
            <h1 className="text-2xl font-bold mb-2 mx-auto">{listing.name}</h1>
            <div className="text-sm font-semibold  pl-0 text-start">
              <label className="rating-label ">
                <input
                  aria-label={`Rating ${listing.rating} out of 5`}
                  className="rating"
                  max="5"
                  readonly
                  step="0.01"
                  style={{ "--fill": "#0097a7", "--value": listing.rating }}
                  type="range"
                  alt="Rated {listing.rating}/5"
                />
              </label>
              <div className="relative w-72 inline-flex">
                {listing.meta?.parking && (
                  <img
                    className="w-5 h-5 rounded-lg m-1"
                    src={parkingIcon}
                    alt="Parking possibilities"
                  />
                )}
                {listing.meta?.wifi && (
                  <img
                    className="w-5 h-5 rounded-lg m-1"
                    src={wifiIcon}
                    alt="Wifi access"
                  />
                )}
                {listing.meta?.pets && (
                  <img
                    className="w-5 h-5 rounded-lg m-1"
                    src={petsIcon}
                    alt="Pet-friendly"
                  />
                )}
                {listing.meta?.breakfast && (
                  <img
                    className="w-5 h-5 rounded-lg m-1"
                    src={breakfastIcon}
                    alt="Breakfast included"
                  />
                )}

                <img
                  className="w-5 h-5 rounded-lg m-1 ml-auto"
                  src={guestsIcon}
                />
                {listing.maxGuests}
              </div>
              <p className="text-xs">About:</p>
            </div>

            <p className="text-sm mb-4">{listing.description}</p>
            <p className="text-sm font-medium">
              Price: {listing.price} per night
            </p>

            <div className="flex flex-wrap">
              {listing.tags &&
                listing.tags.map((tag) => (
                  <p
                    key={tag}
                    className="bg-gray-200 rounded-md py-1 px-2 text-xs mr-2 mb-2"
                  >
                    {tag}
                  </p>
                ))}
            </div>
            <button
              className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded active:scale-95 transition duration-150 ease-in-out active:bg-secondary"
              type="submit"
              onClick={() => dispatch(addToCart(listing))}
            >
              Check availability
            </button>
          </div>
        </div>

        <div className="border-2 border-red-500 p-4 m-4">
          <h2>Bookings List:</h2>
          <ul>
            {bookings.map((booking, index) => (
              <li key={index}>
                JSON: {JSON.stringify(booking)}
                <br />
                Date From: {dayjs(booking.dateFrom).format("YYYY-MM-DD")}
                <br />
                Date To: {dayjs(booking.dateTo).format("YYYY-MM-DD")}
              </li>
            ))}
          </ul>
          dateRanges: {JSON.stringify(dateRanges)}
          <h2 className="text-red-500 text-xl">DatePicker:</h2>
          <DatePicker
            label="Select a date"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat={"dd/MM/yyyy"}
            minDate={new Date()}
            className="border-2 border-red-500 p-4 m-4 text-black"
            filterDate={(date) => {
              // Check if the date is present in the dateRanges array
              const isDateDisabled = dateRanges.some((dateRange) => {
                return (
                  date >= dayjs(dateRange.from).startOf("day") &&
                  date <= dayjs(dateRange.to).endOf("day")
                );
              });
              // Return true to disable the date if it is found in dateRanges, false otherwise
              return !isDateDisabled;
            }}
          />
        </div>

        {similarListings.length > 0 && (
          <div>
            <h2 className="text-center text-lg text-primary font-semibold ">
              Venues within same price range or capacity:
            </h2>
            <div className="flex flex-wrap  border-t-2 my-4 py-4 border-gray-300 justify-evenly">
              {similarListings.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-300 rounded-lg p-4 mb-4 mr-4 sm:w-[300px] "
                >
                  <div className="inline-flex flex-col items-center min-h-[300px] h-full py-2 rounded-md">
                    <Link
                      to={`/listings/${item.id}`}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      <img
                        className="inline-flex w-64 h-64 object-cover backdrop-blur-md bg-gray-300 rounded-lg"
                        src={item.media[0]}
                      />

                      <p className="text-sm font-semibold">{item.name}</p>
                      <div className="relative w-72 px-4 inline-flex">
                        {item.meta.parking && (
                          <img
                            className="w-5 h-5 rounded-lg m-1"
                            src={parkingIcon}
                            alt="Parking possibilities"
                          />
                        )}
                        {item.meta.wifi && (
                          <img
                            className="w-5 h-5 rounded-lg m-1"
                            src={wifiIcon}
                            alt="Wifi access"
                          />
                        )}
                        {item.meta.pets && (
                          <img
                            className="w-5 h-5 rounded-lg m-1"
                            src={petsIcon}
                            alt="Pet-friendly"
                          />
                        )}
                        {item.meta.breakfast && (
                          <img
                            className="w-5 h-5 rounded-lg m-1"
                            src={breakfastIcon}
                            alt="Breakfast included"
                          />
                        )}
                        <div className="inline-flex ml-auto">
                          <img
                            className="w-5 h-5 rounded-full m-1"
                            src={guestsIcon}
                            alt="Number of guests"
                          />
                          <p className="text-md font-semibold">
                            {item.maxGuests}
                          </p>
                        </div>
                      </div>
                      <div className="w-full px-4 flex justify-between">
                        <label className="rating-label py-1 ">
                          <input
                            aria-label={`Rated {item.rating} out of 5`}
                            className="rating"
                            max="5"
                            readOnly
                            step="0.01"
                            style={{
                              "--fill": "#0097a7",
                              "--value": item.rating,
                            }} //
                            type="range"
                          />
                        </label>
                        <div className="">
                          <p className="text-xs py-1 ">
                            {" "}
                            {item.price} / night{" "}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <p className="w-64 text-xs font-medium ">
                      {item.description.slice(0, charLimit)}
                      {item.description.length > charLimit && !showMore
                        ? "..."
                        : ""}
                    </p>

                    {showMore && (
                      <p className="w-64 text-xs font-medium">
                        {item.description.slice(charLimit)}
                      </p>
                    )}

                    {item.description.length > charLimit ? (
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleListing;
