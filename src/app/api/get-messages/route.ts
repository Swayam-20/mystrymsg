import UserModel from "@/model/user";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import ApiResponsemessage from "@/utils/ApiResponsemessage";


export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;
    if(!session || !session.user )
    {
        return Response.json(
            {
            success: false,
            message: "Unauthorized or not authenticated",
            status: 401,
            data: null
            });
    }
    const userId = new mongoose.Types.ObjectId(user.id);
    if(!userId){
        return Response.json(
            {
            success: false,
            message: "User ID not found in session",
            status: 400,
            data: null
            });
    }
    try {
        const usermessage = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$message" },
            { $sort: { "message.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$message" }
                }
            },
            {
                $project: {
                    _id: 0,
                    messages: 1
                }
            }
        ])
        if(usermessage.length === 0){
            return Response.json(
                {
                success: true,
                message: "No messages found",
                status: 200,
                data: []
                });
        }
        return Response.json(
            new ApiResponsemessage(
                true,
                "Messages fetched successfully",
                200,
                usermessage[0].messages
            )
        )
    } catch (error) {
        return Response.json(
            {
            success: false,
            message: "Database error",
            status: 500,
            data: null
            });
        
    }
}

