import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {z} from "zod";
import { verifySchema } from "@/Schemas/verifySchema";
import ApiResponsemessage from "@/utils/ApiResponsemessage";


export async function POST(request: Request) {
    await dbConnect();
    
    try {
        const { code, email,username } = await request.json();
        if (!code || !email || !username) {
            return Response.json(new ApiResponsemessage({
                success: false,
                message: "All fields are required",
                statusCode: 400
            }));
        }
        const decodedusername = decodeURIComponent(username);
        const decodedemail = decodeURIComponent(email);
        
        
        const user  = await UserModel.findOne({email:decodedemail,username:decodedusername})
        if(!user)
        {
            return Response.json(new ApiResponsemessage(
                false,
                "User not found",
                404,
                null
            ));
        }
        if(!code.success){
            const codeerror = code.error.format()._errors
            return Response.json(
                new ApiResponsemessage(
                    false,
                    codeerror?.length? codeerror[0] : "Invalid code",
                    400
                    ,null
                    )
                )
        }
        const isverifycode = user.verifycode === code;
        const iscodenotexpired = user.verifycodeExpiry && user.verifycodeExpiry > new Date();
        if(!isverifycode){
            return Response.json(new ApiResponsemessage({
                success: false,
                message: "Invalid verification code",
                statusCode: 400
            }));
        }
        if(!iscodenotexpired){
            return Response.json(new ApiResponsemessage({
                success: false,
                message: "Verification code expired",
                statusCode: 400
            }));
        }
        user.isVerified = true;
        user.save();
        return Response.json(new ApiResponsemessage({
            success: true,
            message: "User verified successfully",
            statusCode: 200
        }));


    } catch (error) {
        console.error("Error in verify code route:", error);
        return Response.json(new ApiResponsemessage({
            success: false,
            message: "Error in verify code",
            statusCode: 500
        }));
        
    }
}