import UserModel from "@/model/user";
import { Message } from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import ApiResponsemessage from "@/utils/ApiResponsemessage";

export async function POST(request:Request)
{
    await dbConnect();
    try {
        const {username , content} = await request.json();
        const user =  await UserModel.findOne({username});
        if(!user || !user.isAcceptingmsg)
        {
            return Response.json(
                    {
                        message:"User not found or not accepting messages"
                    }
                    ,
                    {status:404})
        }
        const newmessage = {
            content:content,
            createdAt:new Date()
        }
        user.message.push(newmessage as Message);
        await user.save();
    
        return Response.json(
            new ApiResponsemessage(
                true,
                "Message sent successfully"
                ,200
                ,newmessage
                ));
    } catch (error) {
        console.log(error);
        return Response.json(
            new ApiResponsemessage(
                false,
                "Database connection error"
                ,500
                ,error
                ));
        
    }
}