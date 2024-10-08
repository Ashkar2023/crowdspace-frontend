import { z } from "zod";

export const passwordSchema = z.object({
    oldPassword: z.string().min(1,"Required Field"),
    newPassword: z.string()
        .min(8, "min 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, "must include A-Z, a-z, 0-9 and !@#$%^&*")
        .trim(),
    confirmPassword:z.string()
}).refine((data)=>data.newPassword===data.confirmPassword,{
    message:"Passwords don't match",
    path:["confirmPassword"]
});