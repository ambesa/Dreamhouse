
const router = require("express").Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads/") // store uploads in the file 
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname) // Corrected line
    }
})

const upload = multer({ storage });
// register form module 

router.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
        // take all the information from the form 
        const { firstname, lastname, email, password } = req.body;
          
        // uploaded file from local file available req.file
        const profileImage = req.file;
        if (!profileImage) {
            return res.status(400).send('no file uploaded');
        }

        const profileImagePath = profileImage.path;

        // check if user email exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // create hashed password 
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user 
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            profileImagePath
        });

        // save new user
        await newUser.save();
        
        // send message 
        res.status(200).json({ message: 'User registered successfully' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// login module ///



router.post("/login", async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Remove the password from the user object before sending the response
    const userWithoutPassword = { ...user.toObject(), password: undefined };

    // Send the response
    res.status(200).json({ token, user: userWithoutPassword });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;