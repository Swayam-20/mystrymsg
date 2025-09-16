import "next-auth"
import { DefaultSession } from "next-auth";


declare module "next-auth" {
    interface User {
        _id?:string;
        username?:string;
        isVerified?:boolean;
        isAcceptingmsg?:boolean;
    }
    interface Token {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingmsg?: boolean;
    }
    interface Session {
        user: DefaultSession["user"] & {
            _id: string;
            username: string;
            isVerified: boolean;
            isAcceptingmsg: boolean;
        };
    }
}
