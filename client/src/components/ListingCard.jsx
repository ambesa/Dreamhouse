

import React, { useState } from 'react';
import { setWishList } from "../redux/state";
import "../styles/ListingCard.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  state,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ADD TO WISHLIST */
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const patchWishList = async () => {
    if (user?._id !== creator._id) {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${user?._id}/${listingId}`,
          {
            method: "PATCH",
            headers: {  // Corrected the typo here
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Wishlist updated:', data.wishList); // Add this line for debugging
        console.log(data);
        dispatch(setWishList(data.wishList));
      } catch (error) {
        console.error("Failed to update wishlist:", error);
      }
    } else {
      return;
    }
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length);
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  return (
    <div className='listing-card' 
      onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
      <div className='slider-container'> 
        <div className='slider' 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        > 
          {listingPhotoPaths?.map((photo, index) => 
            <div key={index} className='slide'>
              <img 
                src={`http://localhost:3000/${photo?.replace("public", "")}`}
                alt={`photo ${index + 1}`}
              />
              <div className='prev-button' 
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>  
              <div className='next-button' 
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              > 
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <h3>{city},{state} {country}</h3> 
      <p>{category}</p>

      {!booking ? (
        <> 
          <p>{type}</p>
          <p><span>${price}</span> per night</p>
        </>
      ) : ( 
        <> 
          <p>{startDate} - {endDate}</p>
          <p><span>${totalPrice}</span> Total</p>
        </>
      )}

      <button 
        className='favorite'
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        disabled={!user}
      > 
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>
    </div>
  );
}

export default ListingCard;