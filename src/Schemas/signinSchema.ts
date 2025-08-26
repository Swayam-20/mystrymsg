import {z} from "zod"

export const signinSchema=z.object({
    Indentifier:z.string().length(2,"usrname is atleast of 2 length"),
    password:z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
})
