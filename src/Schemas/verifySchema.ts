import {z} from "zod"

export const verifySchema=z.object({
    code:z.string().length(6,"verify code atleast of 6 digits")
})
