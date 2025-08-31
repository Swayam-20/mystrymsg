import mongoose ,{Schema,Document}from "mongoose";


export interface Message extends Document{
    content :string;
    createdAt:Date;
}

const MessageSchema : Schema<Message> =new Schema({
    content:{
        type:String,
        required:[true,"content is required"]
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface user extends Document{
    username:string;
    email:string;
    password:string;
    verifycode:string;
    verifycodeExpiry:Date;
    isVerified:boolean;
    isAcceptingmsg:boolean;
    message:Message[]
}

const Userschema:Schema<user> = new Schema(
    {
        username:
        {
            type:String,
            required:[true,"username is required"],
            unique:true,
            trim:true
        },
        email:{
            type:String,
            required:[true,"eamil is required"],
            unique:true,
            match:[/.+\@.+\..+/,"please enter the valid email"],
            trim:true
        },
        password:{
            type:String,
            required:[true,"password is required"],
        },
        verifycode:{
            type:String,
            required:[true,"verify code is required"],
        },
        verifycodeExpiry:{
            type:Date,
            required:[true,"verify code expiry is required"]
        },
        isVerified:{
            type:Boolean,
            default:false
        }
        ,
        isAcceptingmsg:{
            type:Boolean,
            required:true,
            default:true
        },
        message:[MessageSchema]
    }
)
const UserModel = mongoose.models.user as mongoose.Model<user> || mongoose.model<user>("user",Userschema)

export default UserModel