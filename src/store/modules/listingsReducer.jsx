import { createSlice } from "@reduxjs/toolkit";

//reducers

const listingsSlice = createSlice({
  name: "listingsReducer",
  initialState: {
    allListings: [],
    listing: {},
    total: 0,
  },
  reducers: {
    SET_ALL_LISTINGS: (state, action) => {
      state.allListings = action.payload;
    },
    SET_LISTING: (state, action) => {
      state.listing = action.payload;
    },
  },
});

export default listingsSlice.reducer;

//actions - API section

const { SET_ALL_LISTINGS } = listingsSlice.actions;
const { SET_LISTING } = listingsSlice.actions;

export const fetchListings = () => async (dispatch) => {
  try {
    const response = await fetch(
      "https://api.noroff.dev/api/v1/holidaze/venues"
    );
    const data = await response.json();
    console.log("api suksess, her er data", data);
    dispatch(SET_ALL_LISTINGS(data));
  } catch (e) {
    return console.error("error from api call", e.message);
  }
};

export const fetchOneListing = (id) => async (dispatch) => {
  let response;
  try {
    response = await fetch(
      `https://api.noroff.dev/api/v1/holidaze/venues/${id}`
    );
    const singleListingData = await response.json();
    dispatch(SET_LISTING(singleListingData));
  } catch (e) {
    return console.error("error from api call single listing", e.message);
  }
  if (response.ok) {
    console.log("response ok from single listing");
  } else {
    console.log("response not ok from single listing");
  }
};
