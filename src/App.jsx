import "./App.css";
import "./index.css";
import { Component } from "react";
import Navbar from "./components/Navbar";
import { fetchListings } from "./store/modules/listingsReducer";
import ListingList from "./components/ListingList";
import { useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Listings from "./components/views/Listings";
import Router from "./routes/Router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ChatBot from "./components/ChatBot";

function App({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <Navbar />
        <ChatBot />
        <Router />
      </div>
    </LocalizationProvider>
  );
}

export default App;
