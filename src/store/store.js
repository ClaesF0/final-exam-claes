import { configureStore, combineReducers } from "@reduxjs/toolkit";
import listingsReducer from "./modules/listingsReducer";

const reducer = combineReducers({
  listingsReducer,
});

const store = configureStore({
  reducer,
});

//const index = configureStore({
//  reducer,
//});

// Fetch initial listings data on app load
//store.dispatch(fetchListings());

export default store;
//export default index;
