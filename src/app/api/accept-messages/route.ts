import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";

import { getServerSession } from "next-auth/next";
import UserModel from "@/model/user";
import ApiResponsemessage from "@/utils/ApiResponsemessage";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if(!session || !session.user )
    {
        return Response.json(
            new ApiResponsemessage
            (
            false,
            "Unauthorized or not authenticated",
            401
            ,null));
    }
    const userId = user._id;
    if(!userId){
        throw new ApiResponsemessage(
            false,
            "User ID not found in session",
            400
        );
    }
    try {
        const { isAcceptingmsg } = await request.json();
        const updateduser = await UserModel.findByIdAndUpdate({userId},
        { isAcceptingmsg },{
            new:true
        })

    if(!updateduser)
    {
        return Response.json
        (
            new ApiResponsemessage
            (
            false,
            "failed to update user message acceptance status",
            404
            ,null));
    }
    return Response.json(
        new ApiResponsemessage
        (
        true,
        "user message acceptance status updated successfully",
        200
        ,updateduser));
    } catch (error) {
        return Response.json(
            new ApiResponsemessage
            (
            false,
            "failed to update user message acceptance status",
            500
            ,null));
        
    }
    
    
    

}

export  async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if(!session || !session.user )
    {
        return Response.json(
            new ApiResponsemessage
            (
            false,
            "Unauthorized or not authenticated",
            401
            ,null));
    }
    const userId = user._id;
    if(!userId){
        throw new ApiResponsemessage(
            false,
            "User ID not found in session",
            400
        );
    }
    try {
        const isAccepted = await UserModel.findById(userId).select("isAcceptingmsg");
        if(!isAccepted)
        {
            return Response.json
            (
                new ApiResponsemessage
                (
                false,
                "user not found",
                404
                ,null));
        }
        return Response.json(
            new ApiResponsemessage
            (
            true,
            "user message acceptance status fetched successfully",
            200
            ,isAccepted));
    } catch (error) {
        return Response.json(
            new ApiResponsemessage
            (
            false,
            "failed to fetch user message acceptance status",
            500
            ,null));
        
    }
}