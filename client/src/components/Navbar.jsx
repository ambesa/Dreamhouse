
import React,{useState} from 'react'
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import "../styles/Navbar.scss";
import {  useSelector,useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import{setLogout} from '../redux/state';

const Navbar = () => {
     const[search,setsearch]=useState('');
    const [dropdownMenu,setdropdownMenu]=useState(false);
    const user= useSelector((state)=>state.user);
    const navigate=useNavigate();
    const dispatch=useDispatch();
  return (
    <div className='navbar'>
        <a href="/"> 
        <img src="/assets/Listing1/logo3.jpeg" alt="alt"/>
       

        </a>
        
        <div className='navbar_search'> 
        <input 
        type='text'
        placeholder='Search ....'
        onChange={(e)=>setsearch(e.target.value)}
        value={search}
        
        />
        <IconButton> 
            <Search 
            sx={{ color: variables.pinkred }}
            onClick={() => {navigate(`/properties/search/${search}`)}}
            />
        </IconButton>

        </div>
        <div className='navbar_right'> 
        {
            user? (<a 
                href="/create-listing " className='host'
            > Become a Host</a>):(
                <a
                href="/login" className='host'
                > Become a Host</a>
            )

        }

        <button
        className='navbar_right_account'
        onClick={()=>setdropdownMenu(!dropdownMenu)}
        > 
        <Menu  
        sx={{ color: variables.darkgrey }}/>
        {
            !user ? ( 
                <Person sx={{ color: variables.darkgrey }}/>
            ):( 
                <img 
                src={`http://localhost:3000/${user.profileImagePath.replace("public","")}`}
                alt="profile photo"
              style={{ objectFit: "cover", borderRadius: "50%" }}
                />
            )
        }
        

        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {
            dropdownMenu && user &&( 
                <div className="navbar_right_accountmenu"> 
                <Link to={`/${user._id}/trips`}> Trip List </Link>
                <Link to={`/${user._id}/wishList`}> Wish List </Link>
                <Link to={`/${user._id}/properties`} > Property List </Link>
                <Link to={`/${user._id}/reservations`}> Reservation  List </Link>
                <Link> Become A Host  </Link>
                <Link 
                to="/login"
                onClick={() => {
                dispatch(setLogout());
              }}
                
                > Log Out </Link>

                </div>
            )
        }

        </div>
      
    </div>
  )
}

export default Navbar










