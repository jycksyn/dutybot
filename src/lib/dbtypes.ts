import { Prisma } from "@prisma/client";

const shiftWithType = Prisma.validator<Prisma.ShiftDefaultArgs>()({
    include: { type: true }
});

export type ShiftWithType = Prisma.ShiftGetPayload<typeof shiftWithType>;


const userWithAuthUser = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: { auth_user: true }
});

export type UserWithAuthUser = Prisma.UserGetPayload<typeof userWithAuthUser>;