import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user"
import bcrypt from "bcryptjs"



export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
                },
                async authorize(credentials:any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or : [
                            {email : credentials.identifier },{ username: credentials.identifier }
                        ]
                        });
                    if (!user) {
                        throw new Error("User not found");
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your email before logging in");
                    }
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
    
                    return user;
                } catch (error:any) {
                    throw new Error(error.message || "An error occurred during authentication");
                }
                
        }})
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString() || "";
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingmsg = user.isAcceptingmsg;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id  as string;
                session.user.username = token.username as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingmsg = token.isAcceptingmsg as boolean;
            }
            return session;
        },
    },
    pages:{
        signIn: "/sign-in",
    },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}
