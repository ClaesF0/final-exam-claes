import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { useState, useEffect } from "react";
import React from "react";
import * as Yup from "yup";
//Calendar-imports
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
dayjs.extend(isBetweenPlugin);
import { makeBooking } from "./holidazeSlice";

export const BookingDatePicker = () => {
  const [bookings, setBookings] = useState([]);
  const { id } = useParams();
  const [venueData, setVenueData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(
      `https://api.noroff.dev/api/v1/holidaze/venues/${id}?_owner=true&_bookings=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((venueData) => {
        setVenueData(venueData);
        const bookingsData = venueData.bookings;
        setBookings(bookingsData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    const dateRanges = bookings.map((booking) => ({
      from: dayjs(booking.dateFrom).toDate(),
      to: dayjs(booking.dateTo).toDate(),
    }));
  }, [bookings]);

  const dateRanges = bookings.map((booking) => ({
    from: dayjs(booking.dateFrom).toDate(),
    to: dayjs(booking.dateTo).toDate(),
  }));

  const validateGuests = (guests) => {
    const maxGuests = venueData ? venueData.maxGuests : 0;
    return Yup.number()
      .min(1, "At least one guest")
      .max(maxGuests, `Max ${maxGuests} guests`)
      .required("Required")
      .validateSync(guests);
  };

  const formik = useFormik({
    initialValues: {
      dateFrom: null,
      dateTo: null,
      guests: 1,
    },
    validationSchema: Yup.object({
      dateFrom: Yup.date().required("Required"),
      dateTo: Yup.date().required("Required"),
      guests: Yup.number().test(
        "guests",
        "Invalid number of guests",
        validateGuests
      ),
    }),
    onSubmit: (values) => {
      const payload = {
        dateFrom: values.dateFrom,
        dateTo: values.dateTo,
        guests: values.guests,
        venueId: id,
      };
      dispatch(makeBooking(payload))
        .then(() => {
          alert("Booking successful!");
        })
        .catch((error) => {
          alert("Something went wrong. Please try again.");
        });
    },
  });

  const handleMakeBooking = () => {
    const token = localStorage.getItem("token");

    const payload = {
      dateFrom: formik.values.dateFrom.toISOString(),
      dateTo: formik.values.dateTo.toISOString(),
      guests: formik.values.guests,
      venueId: id,
    };

    fetch("https://api.noroff.dev/api/v1/holidaze/bookings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Booking failed. Please try again.", error.message);
        }
      })
      .then((data) => {})
      .catch((error) => {
        alert("Booking failed. Please try again.");
      });
  };

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

  const validateBooking = Yup.object({
    dateFrom: Yup.date().required("Required"),
    dateTo: Yup.date().required("Required"),
    guests: Yup.number().test(
      "guests",
      "Invalid number of guests",
      validateGuests
    ),
  });

  return (
    <div className="border-2 border-charcoal p-4 m-4 flex flex-wrap justify-evenly">
      <div className="flex flex-wrap justify-center">
        <div className="m-4">
          <DatePicker
            id="dateFrom"
            label="Select a date"
            placeholderText="Select a date from"
            selected={selectedFromDate}
            onChange={(date) => {
              setSelectedFromDate(date);
              formik.setFieldValue("dateFrom", date);
            }}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            className="border-2 border-red-500 p-4 text-black"
            filterDate={(date) => {
              const isDateDisabled = dateRanges.some((dateRange) => {
                return (
                  date >= dayjs(dateRange.from).startOf("day") &&
                  date <= dayjs(dateRange.to).endOf("day")
                );
              });
              return !isDateDisabled;
            }}
          />
        </div>
        <div className="m-4">
          <DatePicker
            id="dateTo"
            label="Select a date"
            placeholderText="Select a date to"
            selected={selectedToDate}
            onChange={(date) => {
              setSelectedToDate(date);
              formik.setFieldValue("dateTo", date);
            }}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            className="border-2 border-red-500 p-4 text-black"
            filterDate={(date) => {
              // Check if the date is present in the dateRanges array
              const isDateDisabled = dateRanges.some((dateRange) => {
                return (
                  date >= dayjs(dateRange.from).startOf("day") &&
                  date <= dayjs(dateRange.to).endOf("day")
                );
              });
              return !isDateDisabled;
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <div className="m-4">
          <input
            id="guests"
            name="guests"
            type="number"
            placeholder={`Guests. (Max ${venueData ? venueData.maxGuests : 0})`}
            className="border-2 border-red-500 p-4 text-black font-semibold w-[200px]"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.numberOfGuests}
          />
        </div>
        <div className="m-4">
          {formik.values.numberOfGuests &&
            venueData &&
            selectedFromDate &&
            selectedToDate && (
              <p className="text-black">
                Price: {formik.values.numberOfGuests} guests * for{" "}
                {dayjs(selectedToDate).diff(selectedFromDate, "day")} days
                booked * at {venueData.price} per day ={" "}
                {formik.values.numberOfGuests *
                  venueData.price *
                  dayjs(selectedToDate).diff(selectedFromDate, "day")}
              </p>
            )}
        </div>
      </div>
      <div className="flex justify-center m-4">
        <button
          className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded active:scale-95 transition duration-150 ease-in-out active:bg-secondary"
          type="submit"
          onClick={() => handleMakeBooking(id)}
        >
          NEW BTN Make booking
        </button>
      </div>
    </div>
  );
};
