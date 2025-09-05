import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {z} from "zod";
import { usernameValidation } from "@/Schemas/signupSchema";
import ApiResponsemessage from "@/utils/ApiResponsemessage";


const usernamequerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){
    await dbConnect()
    // localhost:3000/Api/check-unique-username?username=example
    try {
        const {searchParams} = new URL(request.url) // Get the URL object from the request
        const queryparam ={username  : searchParams.get("username")}  // Extract the username query parameter
        // validate with zod
        const result = usernamequerySchema.safeParse(queryparam)
        console.log("result ",result)
        if(!result.success){
            const usernameerror = result.error.format().username?._errors
            return Response.json(
                new ApiResponsemessage(
                    false,
                    usernameerror?.length? usernameerror[0] : "Invalid username",
                    400
                    ,null
                    )
                )
        }
        // result is valid
        console.log("validated query param ",result.data)
        const {username} = result.data
        const uniqueusername = await UserModel.findOne({username,isVerified:true})
        if(uniqueusername){
            return Response.json(
                new ApiResponsemessage(
                    false,
                    "Username already taken",
                    200
                    ,{isUniqueUsername:false}
                    )
                )
        }
        return Response.json( new ApiResponsemessage(
            true ,
            "Username is available",
            200
        ))
    } catch (error) {
        console.error("error checking username ",error)
        return Response.json(
            new ApiResponsemessage(
                false,
                "Invalid request",
                400
                ,null
                )
            )
    }
}