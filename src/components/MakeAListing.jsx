import React, { useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";

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
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price is not a negative number"),
  maxGuests: Yup.number()
    .required("Number of guests is required")
    .integer("This number must be an integer"),
  rating: Yup.number()
    .optional()
    .min(0, "Rating must be a non-negative number"),
  media: Yup.string().optional(),
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

const MakeAListing = () => {
  const token = localStorage.getItem("token");
  const mediaInputRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      maxGuests: 0,
      rating: 0,
      media: [[]],
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
      },
      location: {
        address: "",
        city: "",
        zip: "",
        country: "",
        continent: "",
        lat: 0,
        lng: 0,
      },
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      // Convert media string to an array by splitting based on comma delimiter
      const mediaArray = values.media.split(",");

      // Update the media field in the values object with the array
      values.media = mediaArray;
      axios
        .post("https://api.noroff.dev/api/v1/holidaze/venues", values, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        .then((response) => {
          // Handle successful creation
          console.log("Venue created:", response.data);
          // Reset the form or redirect to a success page
        })
        .catch((error) => {
          // Handle error
          console.log("Error creating venue:", error);
          // Show an error message to the user
        });
    },
  });

  const tagifyRef = useRef(null);

  useEffect(() => {
    if (mediaInputRef.current) {
      const tagify = new Tagify(mediaInputRef.current, {
        originalInputValueFormat: (valuesArr) =>
          valuesArr.map((item) => item.value).join(","),
      });

      tagifyRef.current = tagify;

      tagify.on("add", () => {
        formik.setFieldValue("media", tagifyRef.current.value);
      });
    }
  }, [mediaInputRef]);

  //function transformer(value) {
  //  return value
  //    .replace(/\\"/g, "") //removes the backslashes.
  //    .replace(/"value:":/g, "HALLO") //removes the "value": part.
  //    .replace(/\["/g, '{ "') //replaces [" with { ".
  //    .replace(/"\]/g, '" }') //replaces "] with " }.
  //    .replace(/},{/g, "}, {"); //adds a comma between objects.
  //}
  //
  //const inputString = formik.values.media;
  //
  //const outputString = transformer(inputString);
  //console.log(outputString);

  return (
    <>
      <form
        onKeyPress={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
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
            Price
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="price"
              name="price"
              min=""
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
            Maximum Guests
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="maxGuests"
              name="maxGuests"
              min="1"
              step="1"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 py-2 px-2 border-charcoal rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
            Rating
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
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Listing
          </button>
          <Link
            to="/listings"
            className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="mx-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Create Listing
          </button>
        </div>
      </form>
    </>
  );
};

export default MakeAListing;
