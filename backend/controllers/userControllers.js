const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const generateToken = require('../Config/generatetoken')

const registerUser = asyncHandler(async(req,res)=> {
    //get the data from the request body
    const {username, email, password, profilePic} = req.body
    if (!username || !email || !password) {
        res.status(400)
        throw new Error('Please fill all the fields')
    }
    //check if the user already exists
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    //create a new user
    const user = await User.create({
        username, 
        email, 
        password, 
        profilePic
    })
    //if the user is created successfully, send back the user data
    if (user) { 
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: User.profilePic,
            token: generateToken(user._id),
        })
    }else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//login user
const authUser = asyncHandler(async(req,res)=> {
    const {email, password} = req.body
    //find the user by email
    const user = await User.findOne({email})
    //if the user exists and the password is correct, send back the user data
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            token: generateToken(user._id),
        })
    }else {
        res.status(401);
        throw new Error("Invalid Email or Password");
      }
})
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  });

//export the functions
module.exports = {registerUser, authUser,allUsers}