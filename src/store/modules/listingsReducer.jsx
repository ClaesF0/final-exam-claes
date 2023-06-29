import { createSlice } from "@reduxjs/toolkit";

//reducers

const listingsSlice = createSlice({
  name: "listingsReducer",
  initialState: {
    allListings: [],
    listing: {},
    total: 0,
    createListing: null,
    deleteListing: null,
    updateListing: null,
  },
  reducers: {
    SET_ALL_LISTINGS: (state, action) => {
      state.allListings = action.payload;
    },
    SET_LISTING: (state, action) => {
      state.listing = action.payload;
    },
    SET_CREATE_LISTING: (state, action) => {
      state.createListing = action.payload;
    },
    SET_DELETE_LISTING: (state, action) => {
      state.deleteListing = action.payload;
    },
    SET_UPDATE_LISTING: (state, action) => {
      state.updateListing = action.payload;
    },
    deleteBooking: (state) => {
      state.listing = null;
    },
  },
});
export const {
  SET_ALL_LISTINGS,
  SET_LISTING,
  SET_CREATE_LISTING,
  SET_DELETE_LISTING,
  SET_UPDATE_LISTING,
  DELETE_BOOKING,
} = listingsSlice.actions;
export default listingsSlice.reducer;

//actions - API section
const token = localStorage.getItem("token");
const name = localStorage.getItem("name");

export const fetchListings = () => async (dispatch) => {
  try {
    const response = await fetch(
      "https://api.noroff.dev/api/v1/holidaze/venues"
    );
    const data = await response.json();
    dispatch(SET_ALL_LISTINGS(data));
  } catch (e) {
    return console.error("REDUCER error from api call", e.message);
  }
};

export const fetchOneListing = (id) => async (dispatch) => {
  let response;
  try {
    response = await fetch(
      `https://api.noroff.dev/api/v1/holidaze/venues/${id}`
    );
    const singleListingData = await response.json();
    dispatch(SET_LISTING(singleListingData)); // Dispatch SET_LISTING action
  } catch (e) {
    return console.error("error from api call single listing", e.message);
  }
  if (response.ok) {
    console.log("response ok from single listing in listingReducer");
  } else {
    console.log("REDUCER response not ok from single listing");
  }
};

export const deleteListing = (id) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://nf-api.onrender.com/api/v1/holidaze/venues/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error when deleting listing", response);
    }
    dispatch(SET_DELETE_LISTING(id));
    window.location.href = `/profiles/${name}`;
  } catch (e) {
    console.error(`Failed to delete listing with ${id}`, e);
  }
};

export const updateListing = (id, listingData) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://nf-api.onrender.com/api/v1/holidaze/venues/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listingData),
      }
    );
    if (response.ok) {
      console.log(" listing updated", response);
    } else {
      throw new Error("REDUCER Error when updating listing", response);
    }
    const data = await response.json();
    console.log(data);
    dispatch(SET_UPDATE_LISTING(data));
    //window.location.href = `/listings/${id}`;
  } catch (e) {
    console.error(`REDUCER Failed to update listing ${id}`, e);
  }
};

export const deleteBooking = (id) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://nf-api.onrender.com/api/v1/holidaze/bookings/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`REDUCER Could not delete booking ${id}`);
    }
    // Remove booking from the state
    dispatch(DELETE_BOOKING());
    window.location.href = `/profiles/${name}`;
  } catch (e) {
    console.error(`REDUCER Could not delete booking with ${id}`, e);
  }
};
