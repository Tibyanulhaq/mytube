import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const userRegister = asyncHandler(async (req,res) => {
    // Get User Data from user
    // Validation - empty fields
    // User existence - username, email
    // get files from User - check for avatar 
    // upload to cloudinary - check if uploaded
    // user creation 
    // check user creation
    // remove password from response
    // return response

    const {username, fullName, email, password} = req.body
    //console.log(username);

    if (
        [username,email,fullName,password].some((field)=>field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required");
    }

    const userExistence = await User.findOne({
        $or: [{username},{email}]
})
    
    if (userExistence) {
        throw new ApiError(400,"User with this email and username already exists")
    }
    // check it before move furthur
    //const localAvatarPath = req.files?.avatar[0]?.path
    let localAvatarPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>0) {
        localAvatarPath = req.files.avatar[0].path
    }else{
        throw new ApiError(400,"Avatar is required")
    };

    let localcoverImagePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
        localcoverImagePath = req.files.coverImage[0].path
    };

    const avatar = await uploadOnCloudinary(localAvatarPath)
    const coverImage = await uploadOnCloudinary(localcoverImagePath)

    if(!avatar){
        throw new ApiError(400,"Avatar is invalid")
    }

    const user = await User.create(
        {
            username,
            fullName,
            email,
            password,
            avatar:avatar.url,
            coverImage:coverImage?.url || ""
        }
    )

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser,"User Registered Successfully")
    )
 


})

export {userRegister}