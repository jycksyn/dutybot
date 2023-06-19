import { z } from "zod";

export const userInfoSchema = z.object({
    name: z.string().min(1),
    email: z.string().email()
});