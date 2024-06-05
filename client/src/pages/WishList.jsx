
import {useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import "../styles/List.scss";
import React from 'react'
//import state from '../redux/state';

const WishList = () => {
  const wishList= useSelector((state)=>state.user.wishList);
    
  return (
    <> 
    <Navbar/>
    <h1 className="titel-list"> Your wish List </h1>
    <div className='list'>
        

        {wishList?.map(
          ({
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
          )
        )}
    </div>
    </>
    
  )
}

export default WishList

