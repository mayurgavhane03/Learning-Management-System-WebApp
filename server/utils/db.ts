import mongoose from "mongoose";

require('dotenv').config();


const dbUrl:string = process.env.DB_URL || ''


const connectDb =  async () => {
    try{
        (await mongoose.connect(dbUrl)).isObjectIdOrHexString((data:any)=>{
            console.log(`Server is Connected with Port ${process.env.PORT}`);

        })

    }catch(err){
        console.log(err.message);
        setTimeout(connectDb,50000);
    }
}


export default connectDb