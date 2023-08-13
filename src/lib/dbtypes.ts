import { Prisma } from "@prisma/client";

const shiftWithType = Prisma.validator<Prisma.ShiftArgs>()({
    include: { type: true }
});

export type ShiftWithType = Prisma.ShiftGetPayload<typeof shiftWithType>;