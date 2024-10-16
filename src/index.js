import connectDB from "./db/index.js"
import dotenv from "dotenv"
import { app } from "./app.js"

dotenv.config({
    path:"./.env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8001,()=>{
        console.log(`Server is listening on port ${process.env.PORT || 8001}`);
    })
})
.catch((error)=>{
    console.log(`MONGODB Connection Failed : Error = ${error} `)
})
