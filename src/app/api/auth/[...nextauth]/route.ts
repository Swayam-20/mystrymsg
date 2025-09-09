import nextAuth from "next-auth";
import { authOptions } from "./options"



const handler = nextAuth(authOptions);


export { handler as GET, handler as POST };
// This code exports the NextAuth handler for both GET and POST requests.