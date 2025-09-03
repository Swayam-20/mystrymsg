import * as z from "zod"

export const signinSchema=z.object({
    identifier:z.string().min(2," Username or Email must be at least 2 characters long").max(50,"Username or Email must be less than 50 characters long"),
    password:z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/),
    
})
