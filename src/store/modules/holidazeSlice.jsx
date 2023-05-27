import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const makeBooking = (payload) => {
  return async (dispatch) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://api.noroff.dev/api/v1/holidaze/bookings/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Booking successful!", data);
      } else {
        throw new Error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error making a booking:", error);
      throw error;
    }
  };
};

const holidazeSlice = createSlice({
  name: "bookingReducer",
  initialState: {
    bookings: [],
    numberOfBookings: 0,
    total: 0,
    bookingsWithStuffInIt: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeBooking.pending, (state) => {
        state.error = null;
      })
      .addCase(makeBooking.fulfilled, (state, action) => {
        const booking = action.payload;
        state.bookings.push(booking);
        state.numberOfBookings = state.bookings.length;
        state.total += booking.price;
        state.bookingsWithStuffInIt = [...state.bookingsWithStuffInIt, booking];
      })
      .addCase(makeBooking.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default holidazeSlice.reducer;
