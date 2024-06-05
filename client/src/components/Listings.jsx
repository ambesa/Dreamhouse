
import React,{useState,useEffect} from 'react';
import { categories } from '../data';
import Loader from './Loader';
import ListingCard from './ListingCard';
import "../styles/Listing.scss"
//import {SetListings} from '..redux/this.state';
import { useDispatch, useSelector } from "react-redux";
import {setListings} from '../redux/state';


const Listings = () => {

    const dispatch=useDispatch();
    const [loading,setLoading]=useState(true);
    const[selectedcategory,setselectedcategory]=useState('All');

    const listings=useSelector((state)=>state.listings);
    const getFeedListing=async ()=>{
        try {
            const response = await fetch(
                selectedcategory !== "All" 
                    ? `http://localhost:3000/properties?category=${selectedcategory}` 
                    : "http://localhost:3000/properties",
                {
                    method: "GET",
                }
            );

            const data = await response.json()
            // call dispatch to the redux store 
            // and setListing to the data coming from the backend 
            dispatch(setListings({listings:data}));
            setLoading(false);

        }
        catch(error){
            console.log(' fetch listing failed , ' ,error.message)

        }
    }
    useEffect(()=>{
        getFeedListing();
    },[selectedcategory])

  return (
    <>
    <div className='category-list'>
        {
            categories?.map((category,index) => 
             <div 
             className={`category ${category.label === selectedcategory ? "selected" : ""}`}
             key={index}
             onClick={() => setselectedcategory(category.label)}
             > 
                 <div className='category_icon'>

                 {category.item}
                 <p>{category.label}</p>

                 </div>
             </div>
             
            )
        }
        
     </div> 
     {
        loading ? (<Loader/> ):
        ( 
            <div className='listings'> 
            {
            listings.map(({
                _id,
              creator,
              listingPhotoPaths,
              city,
              state,
              country,
              category,
              type,
              price,
              booking=false

            })=>

           ( <ListingCard 
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


           />)
            )
        }

            </div>
        )

     }
    </>
    
  )
}

export default Listings

