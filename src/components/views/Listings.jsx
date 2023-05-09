import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../store/modules/listingsReducer";
import ListingList from "../ListingList";


const Listings = () => {
    const dispatch = useDispatch();
    const listings = useSelector((state) => state.listingsReducer.allListings);

    useEffect(() => {
        dispatch(fetchListings());
    }, [dispatch]);

    return (
        <div>
             {listings && <ListingList listings={listings} />}
        </div>
    );
};

export default Listings;