import {z} from "zod";


export const usernameValidation = z
        .string()
        .min(2,"Username is atleast of 2 character")
        .max(10,"username is not more than 10 character")
        .regex(/^([A-Za-z0-9]){2,10}$/,"username must not contain special character")

export const signupSchema =z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"password should atleast of 6 length to be strong"}).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
})
