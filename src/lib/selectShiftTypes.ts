import { z } from "zod";

export const selectShiftTypesSchema = z.object({
    types: z.array(z.string()).min(1)
});