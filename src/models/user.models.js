import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken";

const userSchema = new Schema(
    {
        username:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
            lowercase:true
        },
        fullName:{
            type:String,
            required:true,
            trim:true
        },
        avatar:{
            type:String,
            required:true
        },
        coverImage:{
            type:String,
        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Video'
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required!"]
        },
        refreshToken:{
            type:String
        }

    },   
{timestamps:true});

// Hook for Password Hashing
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10);
    next();
});

// Password comparing because of Password hashing  
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

// AccessToken
userSchema.methods.generateAccessToken = function(){
    return jsonwebtoken.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:1
        });
}

// RefreshToken
userSchema.methods.generateRefreshToken = function(){
    return jsonwebtoken.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);