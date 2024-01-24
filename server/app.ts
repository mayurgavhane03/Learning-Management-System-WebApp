require('dotenv').config
import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {ErrorMiddleware} from './middleware/error'
//body parser
//this is like limit
app.use(express.json({limit:"50mb"}))

//cookie-parse
// we use this becausewhen sending data or if we want something frombackend data

app.use(cookieParser())

// cors = cross origin resource sharing
// we make api if aany perosn can access our server data
// we provide our origin in it


app.use(cors(
    {
        origin:process.env.ORIGIN,
    }
))





app.get('/test', (req:Request, res:Response, next:NextFunction) => {
    res.status(200).json({
            success:true,
            message: "Data fetch from Api"
    })

})




//for unknown routes ig gives error that we use
app.all('*', (req:Request, res:Response, next:NextFunction)=>{
    const err = new Error(`Route ${req.originalUrl } not found`)as any
    err.statusCode = 404;
    next(err)
})

app.use(ErrorMiddleware);