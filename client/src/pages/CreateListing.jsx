
import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import { categories, types, facilities } from "../data";

import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
//import Footer from "../components/Footer"

 const CreateListing=()=>{

   // basci count hooks 
   const[guestCount,setguestCount]=useState(0);
   const[bedCount,setbedCount]=useState(1);
   const[bedroomCount,setbedroomCount]=useState(1);
   const[bathroomCount,setbathroomCount]=useState(1);

  
   // amenities 

   const [amenities,setAmenities]=useState([]);
    const handleSelectAmenities=(facility)=>{
       if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((option) => option !== facility)
      );
    } else {
      setAmenities((prev) => [...prev, facility]);
    }

    }

    //  UPLOAD ,DRAG, DROP AND REMOVE PHOTOS 
    const [photos,setPhotos]=useState([]);
    // uploading photo 
    const handleUploadPhotos = (e) => {
        const newPhotos = Array.from(e.target.files);
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    };

    /// draging photo 

    const handleDragPhoto = (result) => {
  if (!result.destination) return;

  // Create a new array from photos
  const items = Array.from(photos);

  // Remove the dragged item from its original position
  const [reorderedItem] = items.splice(result.source.index, 1);

  // Insert the dragged item at its new position
  items.splice(result.destination.index, 0, reorderedItem);

  // Update the photos state
  setPhotos(items);
};
    const handleRemovePhoto=(indexToRemove)=>{
      setPhotos((prevPhotos)=> 
      prevPhotos.filter((_,index) => index!==indexToRemove)
      )

    }

    // DESCRIPTION HOOKS AND FUNCTIONS ///
    const [formDescription,setFormDescription]=useState({
      title: "",
    description: "",
    highlight: "",
    highlightDesc: "",
    price: 0,

    })

    const handleChangeDescription=(e)=>{
      const {name,value}=e.target;
      setFormDescription({
        ...formDescription,
        [name]:value,
      })

    }


    const [type,setType]=useState('');
    const[category,setCategory]=useState('');
    // location hook and function
    const[formLocation,setFormLocation]=useState({
        streetAdress:"",
        aptSuit:"",
        city:"",
        state:"",
        country:"",
    });

    const handleChangeLocation=(e)=>{
      const {name,value}=e.target;
      setFormLocation({
        ...formLocation,
        [name]:value,
      })

    }

    //  LASTLY HANDLE PSOT FUNCTION

    // so firs we need crator id from redux 
    // and use navigate to navigate 
    const creatorId = useSelector((state) => state.user._id);

     const navigate = useNavigate();

    const handlePost= async (e)=>{
      e.preventDefault();
      try {
        const listingForm = new FormData();
        listingForm.append("creator", creatorId);
      listingForm.append("category", category);
      listingForm.append("type", type);
      listingForm.append("streetAddress", formLocation.streetAdress);
      listingForm.append("aptSuite", formLocation.aptSuit);
      listingForm.append("city", formLocation.city);
      listingForm.append("state", formLocation.state);
      listingForm.append("country", formLocation.country);
      listingForm.append("guestCount", guestCount);
      listingForm.append("bedroomCount", bedroomCount);
      listingForm.append("bedCount", bedCount);
      listingForm.append("bathroomCount", bathroomCount);
      listingForm.append("amenities", amenities);
      listingForm.append("title", formDescription.title);
      listingForm.append("description", formDescription.description);
      listingForm.append("highlight", formDescription.highlight);
      listingForm.append("highlightDesc", formDescription.highlightDesc);
      listingForm.append("price", formDescription.price);

        //  and append photos 
        photos.forEach((photo) => {
        listingForm.append("listingPhotos", photo);
      });

      // send post request to the post throgh api 

      const response = await fetch("http://localhost:3000/properties/create",{
        method:"POST",
        body:listingForm,
      })
      if(response.ok){
        navigate("/")
      }
        
      } catch (err) {
        console.log("publishing list failed ",err.message)
        
      }

    }
    return(
       <>
       <Navbar/> 
         <div className="create-listing"> 
       <h1> Publish Your place </h1>
       <form onSubmit={handlePost}> 
        <div className='create-listing_step1'> 
          <h2> Step1: Tell us about your place</h2>
          <hr/>
           <h3>Which of these categories best describes your place?</h3>
           <div className="category-list"> 
            { 
          categories.map((item,index)=> 
           <div key={index}
           className={`category ${
                    category === item.label ? "selected" : ""
                  }`}
                  onClick={() => setCategory(item.label)}
           > 
            <div className='category_icon'>{item.icon}</div>
            <p> {item.label}</p>

           </div>
          )
          }

           </div>
            <h3> What Type of Places will Guests Have </h3>
           <div className="type-list"> 
        {
         types?.map((item,index)=> 
         <div 
         key={index}
          className={`type ${type === item.name ? "selected" : ""}`}
          onClick={() => setType(item.name)}
         > 
             <div className="type_text"> 
             <h4> {item.name}</h4>
             <p> {item.description}</p>
             </div>
             <div 
             className="type_icon" >{item.icon} </div>
            

         </div>
         
         
         )
        }

        <h3> Where Is Your Place Located ?</h3>

        </div>
        <div className="full"> 
        <div className="location"> 
        <p> Street Adress</p>
        <input 
        type="text"
        required
        placeholder='Street Adress'
        name="streetAdress"
        value={formLocation.streetAdress}
        onChange={handleChangeLocation}
        />

        </div>


        </div>

        <div className="half"> 
        <div className="location"> 
        <p> Apt,suit ..etc </p>
        <input 
        type='text'
        required
        name="aptSuit"
        placeholder="Apt Suit if aplicable "
        value={formLocation.aptSuit}
        onChange={handleChangeLocation}
        />

        </div>

        </div>
        <div className="location"> 
        <p> City</p>
        <input 
        type='text'
        required
        placeholder="City"
        name="city"
        value={formLocation.city}
        onChange={handleChangeLocation}
        />

        </div>
        <div className="half"> 
        <div className="location"> 
        <p> State</p>
        <input 
        type='text'
        required
        name='state'
        placeholder="State"
        vaalue={formLocation.state}
        onChange={handleChangeLocation}
        />

        </div>

        </div>
        <div className="location"> 
        <p> Country</p>
        <input 
        type='text'
        required
        placeholder="Country"
        name='country'
        value={formLocation.country}
        onChange={handleChangeLocation}
        />

        </div>

        <h3>Share some basics about your place</h3>
        <div className="basics"> 
        <div className="basic"> 
        <p> Guests</p>
        <div className="basic_count"> 
        <RemoveCircleOutline
        onClick={()=>{guestCount >1 && setguestCount(guestCount - 1)}}

        sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
        />
           <p>{guestCount}</p>
           
         <AddCircleOutline 
         onClick={()=>{ setguestCount(guestCount + 1)}}
         
         sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
         />

        </div>


        </div>
         <div className="basic">
                <p>Bedrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bedroomCount > 1 && setbedroomCount(bedroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{bedroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setbedroomCount(bedroomCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>

              <div className="basic">
                <p>Beds</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bedCount > 1 && setbedCount(bedCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{bedCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setbedCount(bedCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>

               
               <div className="basic">
                <p>Bathrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bathroomCount > 1 && setbathroomCount(bathroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{bathroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setbathroomCount(bathroomCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>
              
              

        </div>
        
          

        </div>

        <div className="create-listing_step2"> 
       
       <h2>Step 2: Make your place stand out</h2>
            <hr />
             <h3>Tell guests what your place has to offer</h3>
             <div className="amenities">

              {
                facilities?.map((item,index)=> 
                <div 
                className={`facility ${
                    amenities.includes(item.name) ? "selected" : ""
                  }`}
                  key={index}

                  onClick={()=>handleSelectAmenities(item.name)}

                >  
                  <div className="facility_icon">{item.icon} </div>
                  <p>{item.name}</p>
                </div>
                )
              }
               

             </div>

              <h3>Add some photos of your place</h3>
              <DragDropContext onDragEnd={handleDragPhoto}> 
               <Droppable  droppableId="photos" direction="horizontal"> 

                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <>
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="alone">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}

                    {photos.length >= 1 && (
                      <>
                        {photos.map((photo, index) => {
                          return (
                            <Draggable
                              key={index}
                              draggableId={index.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="photo"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt="place"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                  >
                                    <BiTrash />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="together">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                )}



               </Droppable>
                
              </DragDropContext>

               <h3>What make your place attractive and exciting?</h3>
               <div className="description"> 
               <p> Title</p>
               <input 
               name='title'
               value={formDescription.title}
               onChange={handleChangeDescription}
               required
               placeholder="enter Title"
               />

               <p> Description</p>
               <textarea 
               name="description"
               type='text'
               placeholder="Description"
               value={formDescription.description}
               onChange={handleChangeDescription}
               

               />
               <p> Highlight</p>
               <input
               type="text"
                placeholder="Highlight"
                name="highlight"
                value={formDescription.highlight}
                onChange={handleChangeDescription}
                required
               />
               <p>Highlight details</p>
              <textarea
                type="text"
                placeholder="Highlight details"
                name="highlightDesc"
                value={formDescription.highlightDesc}
                onChange={handleChangeDescription}
                required
              />
               <p>Now, set your PRICE</p>
               <span>$</span>
              <input
                type="number"
                placeholder="100"
                name="price"
                value={formDescription.price}
                onChange={handleChangeDescription}
                className="price"
                required
              />

               </div>

               
        </div>
            
        <button className="submit_btn" type="submit">
            CREATE YOUR LISTING
          </button>
       </form>
       </div>
       </>
    )


 }

 export default CreateListing;










