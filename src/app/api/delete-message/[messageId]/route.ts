import UserModel from "@/model/user";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import ApiResponsemessage from "@/utils/ApiResponsemessage";


export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId;
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
    try {
        const updatedmessage = await UserModel.updateOne({
            _id:user._id
        },
        {
            $pull: { messages: { _id:messageId } }
        });
        if(updatedmessage.modifiedCount === 0){
            return Response.json(new ApiResponsemessage(false, "Message not found or could not be deleted", 404, null));
        }
        return Response.json(new ApiResponsemessage(true, "Message deleted successfully", 200, null));
    } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json(new ApiResponsemessage(false, "Internal Server Error", 500, null));
        
    }
    
}

