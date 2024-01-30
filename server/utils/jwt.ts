import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Upload session when user logs in to maintain cache
    redis.set(user._id, JSON.stringify(user));

    // Parse environment variables to integrate with fallback values
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
    const refreshTokenExpire = parseInt(process.env.AREFRESH_TOKEN_EXPIRE || '1200', 10);

    // Options for cookie
    const accessTokenOptions: ITokenOptions = {
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax',
    };

    const refreshTokenOptions: ITokenOptions = {
        maxAge: refreshTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax',
    };

    // Only set secure to true in production
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
