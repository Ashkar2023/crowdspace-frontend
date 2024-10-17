import { z } from "zod";

export const linkSchema = z.string().url({
    message:"Invalid URL"
})