


import "../styles/List.scss";

import React,{useState,useEffect} from 'react';
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

import ListingCard from "../components/ListingCard";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";



const TripList = () => {

    const [loading,setLoading]=useState(true);
    const userId=useSelector((state)=>state.user._id);
     const tripList=useSelector((state)=>state.user.tripList);

     const dispatch=useDispatch();

     const getTriprList= async()=>{

        try{
            const response= await fetch( `http://localhost:3000/users/${userId}/trips`,
            {
                method:"GET",

            }
            );

            const data= await response.json();
            dispatch(setTripList(data));
            setLoading(false);

        }
        catch(error){
            console.log(' fetching trip list failed ',error.message)

        }
     }

     useEffect(()=>{
        getTriprList()

     },[])
    
  return  loading ?(
    <Loader/> 
  ):
  (
    <> 
   <Navbar/>
    <h1 className="title-list">Your Trip List</h1>
    <div className="list"> 
    {
        tripList?.map(({listingId, hostId, startDate, endDate, totalPrice, booking=true})=> 
        <ListingCard 
            listingId={listingId._id}
            creator={hostId._id}
            listingPhotoPaths={listingId.listingPhotoPaths}
            city={listingId.city}
            state={listingId.state}
            country={listingId.country}
            category={listingId.category}
            startDate={startDate}
            endDate={endDate}
            totalPrice={totalPrice}
            booking={booking}

        />
        )
    }

    </div>
    </>
  )

    
  
}

export default TripList



