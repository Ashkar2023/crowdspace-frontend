import { z } from "zod";

const signupSchema = z.object({
    email: z.string().email().max(253, "email length shouldn't exceed 253").trim(),
    displayname: z.string().min(3).max(50, "max 50 characters").trim(),
    username: z.string()
        .toLowerCase()
        .min(2)
        .regex(/^(?![.])(?!.*[.]{2})(?!.*[.]$)(?!^[.])[a-z0-9._]*[a-z0-9_]$/, "can contain [a-z, _, .dot] and shouldn't end/start with .dot")
        .trim(),
    password: z.string()
        .min(8, "min 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, "must include A-Z, a-z, 0-9 and !@#$%^&*")
        .trim()
})

export default signupSchema;