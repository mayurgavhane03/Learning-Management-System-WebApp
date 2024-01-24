import { app } from "./app";
import connectDb from "./utils/db";
require("dotenv").config()


4
//create server

app.listen(process.env.PORT,()=>{
    console.log(`port is started on ${process.env.PORT}`)
    connectDb();
})