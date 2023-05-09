import "./App.css";
import "./index.css";
import Navbar from './components/Navbar';
import  {fetchListings}  from './store/modules/listingsReducer';
import ListingList from './components/ListingList';
import { useEffect } from 'react';
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import Listings from './components/views/Listings';
import Router from './routes/Router';


function App() {
  
  const dispatch = useDispatch();
  //const {listings} = useSelector((state) => state.listingsReducer);
  //console.log("listings",listings)
  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);
  
  return (
    <div className="App">
      hei
      <Router />
      
    </div>
  );
}

export default App;