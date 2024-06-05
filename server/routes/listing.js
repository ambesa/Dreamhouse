

const router = require("express").Router();

const multer = require("multer");

const Listing = require("../models/Listing");
const User = require("../models/User");
///const {default: Listings} = require("../../client/src/components/Listings");



/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});
const upload = multer({ storage });

// create the routes api   to post it to the database 

router.post("/create", upload.array("listingPhotos"),async (req,res)=>{

    try {

    // take information from the fronmne end form of createlisting.jsx

    const { 
        creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      state,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files;
    if (!listingPhotos) {
      return res.status(400).send("No file uploaded.")
    }
    const listingPhotoPaths = listingPhotos.map((file) => file.path);

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      state,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    })

    await newListing.save()

    res.status(200).json(newListing)

        
    } catch (err) {
        res.status(409).json({ message: "Fail to create Listing", error: err.message })
    console.log(err)
        
    }

})

// get  listings by category 
router.get("", async (req,res) =>{

  try{

    const qCategory= req.query.category;
    let listings
    if (qCategory){
      listings= await Listing.find({category:qCategory}).populate("creator");

    }
    else{
      listings= await Listing.find().populate("creator");

    }

    res.status(200).json(listings)


  }
  catch(error){
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(error)

  }


})

// get listing detailes api 

router.get("/:listingId", async(req,res)=>{
  try{
    const {listingId} =req.params
    const listing = await Listing.findById(listingId).populate("creator");
    res.status(200).json(listing);


  }
  catch(error){
    res.status(404).json({ message: "Listing can not found!", error: error.message })

  }

})


//  get listing by search 

router.get("/search/:search", async (req, res) => {
  const { search } = req.params

  try {
    let listings = []

    if (search === "all") {
      listings = await Listing.find().populate("creator")
    } else {
      listings = await Listing.find({
        $or: [
          { category: {$regex: search, $options: "i" } },
          { title: {$regex: search, $options: "i" } },
        ]
      }).populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})



module.exports = router