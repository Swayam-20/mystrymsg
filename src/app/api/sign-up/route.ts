import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import ApiResponsemessage from "../../../utils/ApiResponsemessage";
import { sendVerificationEmail } from "@/helper/sendverificationemail";
import ApiErrorMessage from "../../../utils/ApiErrorMessage";
export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        if (!username || !email || !password) {
            throw new ApiErrorMessage({
                message: "All fields are required",
                statusCode: 400
            });
        }
        const existinguserverifed = await UserModel.findOne({ username, isVerified: true });
        if (existinguserverifed) {
            return Response.json(new ApiResponsemessage({
                success: false,
                message: "User already exists",
                statusCode: 400
            }));
        }
        const existinguserbyemail = await UserModel.findOne({ email });
        if(existinguserbyemail) {
            if(existinguserbyemail.isVerified) {
                return Response.json(new ApiResponsemessage({
                    success: false,
                    message: "Email already registered and verified",
                    statusCode: 400
                }));
            }
            // If the email exists but is not verified, we can update the user details
            existinguserbyemail.username = username;
            existinguserbyemail.password = await bcrypt.hash(password, 10);
            existinguserbyemail.verifycode = Math.floor(100000 + Math.random() * 900000).toString();
            existinguserbyemail.verifycodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes expiry
            await existinguserbyemail.save();
            const emailResponse = await sendVerificationEmail(email, existinguserbyemail.verifycode, username);
        if (!emailResponse.success) {
            return Response.json(new ApiResponsemessage({
                success: false,
                message: "Failed to send verification email }} ",
                statusCode: 500
            }));
        }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
            // Generate a verification code expiry time in two method
            const verifycodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes expiry
            // const expirycode= new Date();
            // expirycode.setHours(expirycode.getHours() + 1); // Set expiry to 1 hour from now



            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifycode,
                verifycodeExpiry,
                isVerified: false,
                isAcceptingmsg:true,
                message: []
            });

            await newUser.save();

            const emailResponse = await sendVerificationEmail(email,verifycode, username);
        if (!emailResponse.success) {
            return Response.json(new ApiResponsemessage({
                success: false,
                message: "Failed to send verification email || please try again later",
                statusCode: 500
            }));
        }
        }
        // If the email is sent successfully, return a success response


            return Response.json(
                new ApiResponsemessage(
                    true,
                    "Registration successful and verification email sent",
                    200,
                    { username, email}
                
            ));
        
    } catch (error) {
        console.error("error registring user ", error);
        return Response.json(new ApiResponsemessage(
                false,
                "Error registring user",
                500
                ,null
                ));
    }
}