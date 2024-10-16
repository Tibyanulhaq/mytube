import {v2 as cloudinary} from "cloudinary"
import {fs} from "fs"

cloudinary,config({
    cloud_name:Process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {

    if(!localFilePath) return null;
    try {
        const uploadResponse = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log(uploadResponse);
        fs.unlinksync(localFilePath);
        return uploadResponse;
    } catch (error) {
        fs.unlinksync(localFilePath);
        return null;
    } 
}

export default uploadOnCloudinary;