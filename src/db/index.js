import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MONGODB Connected !! Host :  ${connInstance.connection.host}`);
        //console.log(connInstance);
    } catch (error) {
        console.log("MongoDB connection Failed : " , error);
    }
} 

export default connectDB;