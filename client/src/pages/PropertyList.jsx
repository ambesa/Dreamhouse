

import React,{useEffect,useState} from 'react'
import "../styles/List.scss";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
//import { setPropertyList } from "../redux/state";
import ListingCard from '../components/ListingCard';
import Navbar from '../components/Navbar';


const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList || [];

  const dispatch = useDispatch();

  const getPropertyList = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user._id}/properties`, {
        method: 'GET',
      });

      const data = await response.json();
      dispatch(setPropertyList(data));
      setLoading(false);
    } catch (error) {
      console.error("Fetch all properties failed", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getPropertyList();
    }
  }, [user?._id]);

  return (
    loading ? <Loader /> : (
      <>
        <Navbar />
        <h1 className="title-list">Your Property List</h1>
        <div className="list">
          {propertyList?.map(({
            _id,
            creator,
            listingPhotoPaths,
            city,
            state,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              key={_id}
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              state={state}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          ))}
        </div>
      </>
    )
  );
};

export default PropertyList;