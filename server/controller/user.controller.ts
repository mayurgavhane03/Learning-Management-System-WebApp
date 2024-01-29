import { Request, Response, NextFunction } from 'express';
import userModel from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import sendMail from '../utils/sendMail';
import jwt, { Secret } from 'jsonwebtoken'; // Import jwt and Secret
import { IUser } from '../models/user.model';
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        //we are taking this from our body
        const { name, email, password } = req.body;
   // we are checking
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler('Email Already Exist', 400));
        }

        const user: IRegistrationBody = {
            name,
            email,
            password,
        };

        const activationToken = createActivationToken(user);

        const activationCode = activationToken.activationCode;

        const data = { user: { name: user.name }, activationCode };
           //go sendMail
        try {
            await sendMail({
                email: user.email,
                subject: 'Activate Your Account',
                template: 'activation-mail.ejs',
                data,
            });

            res.status(201).json({
                success: true,
                message: `Please check your email (${user.email}) to activate your account`,
                activationToken: activationToken.token,
            });
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (err:any) {
        return next(new ErrorHandler(err.message, 400));
    }
});

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET as Secret, // Change this line
        {
            expiresIn: '5m',
        }
    );
    return { token, activationCode };
};





// activate User // 

/* 
interface IActivationRequest {
    activation_token: string;
    activation_code: string;

}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next:NextFunction)=>{
    try{

        const { activation_token, activation_code } = req.body as IActivationRequest;

       const newUser : { user:IUser; activationCode:string } = jwt.verify(
        activation_token, 
        process.env.ACTIVATION_SECRET as string
       ) as {user:IUser; activationCode:string}

       if(newUser.activationCode !== activation_code){
        return next(new ErrorHandler('Invalid Activation Code', 400));
       }

       const {name, email, password} = newUser.user;

       const existUser  = await userModel.findOne({email});
       if(existUser){
        return next(new ErrorHandler('User already exists',400))
       }//now we create user in database
       const user = await userModel.create({name, email, password});

       res.status(201).json({
        success.true,
       })

    }catch(err:any){
        return next(new ErrorHandler(err.message, 400));
    }
}) */







