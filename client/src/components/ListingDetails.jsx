
import React,{useState,useEffect} from 'react';
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const ListingDetails = () => {
    const [loading,setLoading]=useState(true);
    const[listing,setListing]=useState(null);
    const[showError,setShowError]=useState(false);
    const {listingId}=useParams();
    const getListingDetails= async ()=>{
        try{
            const response= await fetch(
                `http://localhost:3000/properties/${listingId}`,
                {
                   method:"GET" ,
                }
            )

            const data= await response.json();
            console.log(data);
            setListing(data);
            setLoading(false);

        }
        catch(error){
            console.log("Fetch Listing Details Failed", error.message);

        }
    }

    useEffect(() => {
    getListingDetails();
  }, []);

  //  crete booking range 
    const [dateRange,setDateRange]=useState([
      {
        startDate:new Date(),
        endDate:new Date(),
        key:"selection",

      }  

    ])

    //  make selection function 
     const handleSelect=(ranges)=>{
        setDateRange([ranges.selection])

     }

     const start= new Date(dateRange[0].startDate);
     const end= new Date(dateRange[0].endDate);
     const dayCount= Math.round(end-start)/(1000*60*60*24);
     /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id)

  const navigate = useNavigate()

  const handleSubmit=async()=>{

    if (!customerId) {
            setShowError(true);
            return;
        }
    try{

        const bookingForm={
            customerId,
            listingId,
            hostId:listing.creator._id,
            startDate:dateRange[0].startDate.toString(),
            endDate:dateRange[0].endDate.toString(),
            totalPrice:listing.price * dayCount,

        }
        const response= await fetch("http://localhost:3000/bookings/create",{
            method:"POST",
            headers:{
                 "Content-Type": "application/json",
            },
            body:JSON.stringify(bookingForm)

        }
         
        )

        if (response.ok){
            navigate(`/${customerId}/trips`)
        }

    }
    catch(error){
        console.log("Submit Booking Failed.", error.message)

    }
  }

  return ( 
    loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item) => (
            <img
              src={`http://localhost:3000/${item.replace("public", "")}`}
              alt="listing photo"
            />
          ))}
        </div>
        <h2>
          {listing.type} in {listing.city}, {listing.state},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={`http://localhost:3000/${listing.creator.profileImagePath.replace(
              "public",
              ""
            )}`}
          />
          <h3>
            Hosted by {listing.creator.firstname} {listing.creator.lastname}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />
        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  ${listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <button className="button" type="submit"  onClick={handleSubmit}>
                BOOKING
              </button>
              {showError && <p className="error-message" 
              style={{color: "red", border: "1px solid red", borderRadius: "5px", padding: "5px"}}
              >Please sign up first to book.</p>}
            </div>
          </div>
        </div>
      </div>

     
    </>
  )

  )
  
}

export default ListingDetails



