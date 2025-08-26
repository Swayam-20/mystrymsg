import {z} from "zod"

export const messageSchema =z.object({
    content:z
    .string()
    .min(10,{message:" should be of atleast 10 "})
    .max(300,{message:" should not exceed 300 letter "})
})
