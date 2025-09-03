import {resend} from "@/lib/resend";
import VerificationOtpEmail from "../../email/Verificationemail";

import { ApiResonse } from "@/types/Apiresponse";


export async function sendVerificationEmail(
    email: string,
    otp: string,
    username: string
) : Promise<ApiResonse>
{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'jaiswalswayam.jaiswal@gmail.com',
            subject: "Verify Your Email",
            react: VerificationOtpEmail({username, otp}),
        });
        return {
            success: true,
            message: "Verification email successfully sent",
            statusCode: 200
        };
    }
    catch (emailerror) {
        console.error("Error sending verification email:", emailerror);
        return {
            success: false,
            message: "Failed to send verification email",
            statusCode: 500
        };
    }
}