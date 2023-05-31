import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { fetchOneListing } from "../store/modules/listingsReducer";
import { Link } from "react-router-dom";
import React, { useRef } from "react";
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
import { BookingDatePicker } from "../store/modules/BookingDatePicker.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers";
import * as Yup from "yup";
import { useFormik } from "formik";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";

dayjs.extend(isBetweenPlugin);

const TagInput = ({ placeholder, onTagsChange }) => {
  const inputRef = useRef(null);
  const tagifyRef = useRef(null);

  useEffect(() => {
    //const mediaValues = Array.isArray(formik.values.media)
    //  ? formik.values.media.join(", ")
    //  : "";
    if (inputRef.current) {
      tagifyRef.current = new Tagify(inputRef.current, {
        whitelist: [{}],
        enforceWhitelist: true,
        dropdown: {
          enabled: 0,
        },
        callbacks: {
          add: onTagsChange,
          remove: onTagsChange,
        },
      });
    }
  }, [onTagsChange]);
  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className="tagify-input"
    />
  );
};

const validationSchema = Yup.object().shape({
  name: Yup.string().optional().min(3, "Name must be at least 3 characters"),
  description: Yup.string().optional(),
  price: Yup.number().optional().positive("Price is not a negative number"),
  maxGuests: Yup.number().optional().integer("This number must be an integer"),
  rating: Yup.number()
    .optional()
    .min(0, "Rating must be a non-negative number"),
  //media: Yup.string().optional(),
  meta: Yup.object()
    .shape({
      wifi: Yup.boolean().optional(),
      parking: Yup.boolean().optional(),
      breakfast: Yup.boolean().optional(),
      pets: Yup.boolean().optional(),
    })
    .optional(),
  location: Yup.object()
    .shape({
      address: Yup.string().optional(),
      city: Yup.string().optional(),
      zip: Yup.string().optional(),
      country: Yup.string().optional(),
      continent: Yup.string().optional(),
      lat: Yup.number().optional(),
      lng: Yup.number().optional(),
    })
    .optional(),
});

const EditAListing = () => {
  //CARDS
  const { id } = useParams();
  const dispatch = useDispatch();
  const { listing } = useSelector((state) => state.listingsReducer);

  const [charLimit, setCharLimit] = React.useState(60); // default character limit
  const [showMore, setShowMore] = React.useState(false);

  const toggleShowMore = () => setShowMore(!showMore);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchOneListing(id));
  }, [dispatch, id]);

  useEffect(() => {
    fetch("https://api.noroff.dev/api/v1/holidaze/venues/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA FROM EDIT LISTING", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [listing]);
  //
  const token = localStorage.getItem("token");
  const mediaInputRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      name: listing.name,
      description: listing.description,
      price: listing.price,
      maxGuests: listing.maxGuests,
      rating: listing.rating,
      media: listing.media,
      meta: {
        wifi: listing.meta?.wifi,
        parking: listing.meta?.parking,
        breakfast: listing.meta?.breakfast,
        pets: listing.meta?.pets,
      },
      location: {
        address: listing.location?.address,
        city: listing.location?.city,
        zip: listing.location?.zip,
        country: listing.location?.country,
        continent: listing.location?.continent,
        lat: listing.location?.lat,
        lng: listing.location?.lng,
      },
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      // Convert media string to an array by splitting based on comma delimiter
      const mediaArray = values.media.split(",");

      // Update the media field in the values object with the array
      values.media = mediaArray;

      const options = {
        method: "PUT",
        url: `https://api.noroff.dev/api/v1/holidaze/venues/${id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
        data: values,
      };

      axios
        .request(options)
        .then((response) => {
          // Handle successful creation
          console.log("SUKSESS Venue updated:", response.data);
          // Reset the form or redirect to a success page
        })
        .catch((error) => {
          // Handle error
          console.log("Error updating venue:", error);
          // Show an error message to the user
        });
    },
  });

  //const formik = useFormik({
  //  initialValues: {
  //    name: listing.name,
  //    description: listing.description,
  //    price: listing.price,
  //    maxGuests: listing.maxGuests,
  //    rating: listing.rating,
  //    media: listing.media || [[]],
  //    meta: {
  //      wifi: listing.meta?.wifi,
  //      parking: listing.meta?.parking,
  //      breakfast: listing.meta?.breakfast,
  //      pets: listing.meta?.pets,
  //    },
  //    location: {
  //      address: listing.location?.address,
  //      city: listing.location?.city,
  //      zip: listing.location?.zip,
  //      country: listing.location?.country,
  //      continent: listing.location?.continent,
  //      lat: listing.location?.lat,
  //      lng: listing.location?.lng,
  //    },
  //  },
  //  validationSchema: validationSchema,
  //
  //  onSubmit: (values) => {
  //    // Convert media string to an array by splitting based on comma delimiter
  //    const mediaArray = values.media.split(",");
  //
  //    // Update the media field in the values object with the array
  //    values.media = mediaArray;
  //    axios
  //      .put("https://api.noroff.dev/api/v1/holidaze/venues" + id, values, {
  //        headers: {
  //          "Content-Type": "application/json",
  //          Authorization: `Bearer ${token}`,
  //        },
  //      })
  //
  //      .then((response) => {
  //        // Handle successful creation
  //        console.log("SUKSESS Venue updated:", response.data);
  //        // Reset the form or redirect to a success page
  //      })
  //      .catch((error) => {
  //        // Handle error
  //        console.log("Error updating venue:", error);
  //        // Show an error message to the user
  //      });
  //  },
  //});
  console.log("listing", listing);
  console.log("listing.description", listing.description);
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
          </div>
        </div>
      </div>
      {listing.location && (
        <div>
          <form
            onSubmit={formik.handleSubmit}
            className="my-2 grid grid-cols-1 gap-y-6 gap-x-8 max-w-[800px] mx-auto px-2 "
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  placeholder={listing.name}
                  initialValues={listing.name}
                  id="name"
                  name="name"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  placeholder={listing.description}
                  initialValues={listing.description}
                  rows="3"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price currently {listing.price}
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder={listing.price}
                  initialValues={listing.price}
                  min="0"
                  step="100"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.price}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="maxGuests"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Guests currently {listing.maxGuests}
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="maxGuests"
                  name="maxGuests"
                  placeholder={listing.maxGuests}
                  initialValues={listing.maxGuests}
                  step="1"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  defaultValue={listing.maxGuests}
                  value={formik.values.maxGuests}
                />
                {formik.touched.maxGuests && formik.errors.maxGuests ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.maxGuests}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Rating currently {listing.rating}
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  max="5"
                  min="0"
                  step="0.1"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.rating}
                />
                {formik.touched.rating && formik.errors.rating ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.rating}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="media"
                className="block text-sm font-medium text-gray-700"
              >
                Media URLs
              </label>
              <div className="mt-1">
                <input
                  ref={mediaInputRef}
                  type="text"
                  id="media"
                  name="media"
                  placeholder={listing.media}
                  initialValues={listing.media}
                  className="tagify-input shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.media}
                />
                {formik.touched.media && formik.errors.media ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.media}
                  </div>
                ) : null}
              </div>
            </div>
            <p className="text-center">Facilities:</p>
            <div className="flex justify-evenly">
              <div>
                <label
                  htmlFor="meta.wifi"
                  className="block text-sm font-medium text-gray-700"
                >
                  Wifi
                </label>
                <div className="mt-1">
                  <input
                    type="checkbox"
                    id="meta.wifi"
                    name="meta.wifi"
                    className="shadow-sm focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.meta.wifi}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="meta.parking"
                  className="block text-sm font-medium text-gray-700"
                >
                  Parking
                </label>
                <div className="mt-1">
                  <input
                    type="checkbox"
                    id="meta.parking"
                    name="meta.parking"
                    className="shadow-sm focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.meta.parking}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="meta.breakfast"
                  className="block text-sm font-medium text-gray-700"
                >
                  Breakfast
                </label>
                <div className="mt-1">
                  <input
                    type="checkbox"
                    id="meta.breakfast"
                    name="meta.breakfast"
                    className="shadow-sm focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.meta.breakfast}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="meta.pets"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pets
                </label>
                <div className="mt-1">
                  <input
                    type="checkbox"
                    id="meta.pets"
                    name="meta.pets"
                    className="shadow-sm focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.meta.pets}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="location.address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  placeholder={listing.location.address}
                  id="location.address"
                  name="location.address"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location.address}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location.city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  placeholder={listing.location.city}
                  id="location.city"
                  name="location.city"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location.city}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location.zip"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP Code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="location.zip"
                  name="location.zip"
                  placeholder={listing.location.zip}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location.zip}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location.country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="location.country"
                  name="location.country"
                  placeholder={listing.location.country}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location.country}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location.continent"
                className="block text-sm font-medium text-gray-700"
              >
                Continent
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  placeholder={listing.location.continent}
                  id="location.continent"
                  name="location.continent"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location.continent}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location.lat"
                className="block text-sm font-medium text-gray-700"
              >
                Latitude
              </label>
              <div className="mt-1">
                <input
                  placeholder={listing.location.lat}
                  type="number"
                  id="location.lat"
                  name="location.lat"
                  min="-90"
                  max="90"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location.lat}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location.lng"
                className="block text-sm font-medium text-gray-700"
              >
                Longitude
              </label>
              <div className="mt-1">
                <input
                  placeholder={listing.location.lng}
                  type="number"
                  id="location.lng"
                  name="location.lng"
                  min="-180"
                  max="180"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location.lng}
                />
              </div>
            </div>

            <div>
              <button
                onClick={console.log(formik.values)}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Listing
              </button>
              <Link
                to="/listings"
                className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </Link>
            </div>

            <div className="flex justify-end"></div>
          </form>
        </div>
      )}
      <div></div>
    </>
  );
};

export default EditAListing;
