//import logo from './logo.svg';
import './App.css';
import{Routes,Route}from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateListing from './pages/CreateListing';
import WishList from './pages/WishList';
import ListingDetails from './components/ListingDetails';
import TripList from './pages/TripList';
import PropertyList from './pages/PropertyList';
import ReservationList from './pages/ReservationList';
import SearchPage from './pages/SearchPage';
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
   
    <div className="App">
      
      
      <Routes> 
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route  path="/register" element={<RegisterPage/>}/>
        <Route path="/create-listing" element={<CreateListing/>}/>
        <Route path="/:userId/wishList" element={<WishList/>}/>
        <Route path="/properties/:listingId" element={<ListingDetails/>}/>
        <Route path="/:userId/trips" element={<TripList/>}/>
         <Route path="/:userId/properties" element={<PropertyList />} />
          <Route path="/:userId/reservations" element={<ReservationList />} />
       <Route path="/properties/search/:search" element={<SearchPage/>} />
       <Route path="/properties/category/:category" element={<CategoryPage />} />
      </Routes>
      
      
      
    </div>
  );
}

export default App;
