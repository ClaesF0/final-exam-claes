import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
//import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
//import { fetchOneListing } from "../store/modules/listingsReducer";
//import { Link } from "react-router-dom";
import React from "react";
//import {
//  faBars,
//  faTimes,
//  faXmark,
//  faXmarkCircle,
//} from "@fortawesome/free-solid-svg-icons";
//import parkingIcon from "../assets/parking.svg";
//import wifiIcon from "../assets/wifi.svg";
//import petsIcon from "../assets/pets.svg";
//import breakfastIcon from "../assets/breakfast.svg";
//import guestsIcon from "../assets/guests.svg";

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

export const BookingDatePicker = () => {
  const [bookings, setBookings] = useState([]);
  const { id } = useParams();

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
      .then((venueData) => {
        console.log("Venue data with bookings:", venueData);
        const bookingsData = venueData.bookings;
        console.log("bookingsData", bookingsData);
        setBookings(bookingsData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const dateRanges = bookings.map((booking) => ({
      from: dayjs(booking.dateFrom).toDate(),
      to: dayjs(booking.dateTo).toDate(),
    }));
    console.log("dateRanges FROM BOOKINGDATEPICKER", dateRanges);
  }, [bookings]);
  //export const BookingDatePicker = () => {
  //  //BOOKING AVAILABLE START
  //  const [bookings, setBookings] = useState([]);
  //  const { id } = useParams();
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
  //        console.log("Venue data with bookings:", data);
  //        const bookingsData = data.bookings;
  //        setBookings(bookingsData);
  //      })
  //      .catch((error) => {
  //        console.log(error);
  //      });
  //  }, [id]);

  const dateRanges = bookings.map((booking) => ({
    from: dayjs(booking.dateFrom).toDate(),
    to: dayjs(booking.dateTo).toDate(),
  }));
  console.log("dateRanges FROM BOOKINGDATEPICKER", dateRanges);

  const highlightedDates = useMemo(() => {
    return dateRanges.reduce((accumulator, dateRange) => {
      const { from, to } = dateRange;
      const rangeDates = [];
      let currentDate = dayjs(from);
      while (currentDate.isSame(to, "day") || currentDate.isBefore(to, "day")) {
        rangeDates.push(currentDate.toDate());
        currentDate = currentDate.add(1, "day");
      }
      return [...accumulator, ...rangeDates];
    }, []);
  }, [dateRanges]);

  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);

  return (
    <>
      <div className="border-2 border-red-500 p-4 m-4">
        dateRanges: {JSON.stringify(dateRanges)}
        <h2 className="text-red-500 text-xl">DatePicker:</h2>
        <DatePicker
          label="Select a date"
          placeholderText="Select a date from"
          selected={selectedFromDate}
          onChange={(date) => setSelectedFromDate(date)}
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
        <DatePicker
          label="Select a date"
          placeholderText="Select a date to"
          selected={selectedToDate}
          onChange={(date) => setSelectedToDate(date)}
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
            console.log("selectedToDate to NEDE", selectedToDate);
            // Accessing the selected "from" date
            console.log("selectedFromDate NEDE", selectedFromDate);

            // Return true to disable the date if it is found in dateRanges, false otherwise
            return !isDateDisabled;
          }}
        />
      </div>
      ;
    </>
  );
};
