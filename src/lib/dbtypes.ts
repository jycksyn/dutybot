import { Prisma } from "@prisma/client";

const shiftWithType = Prisma.validator<Prisma.ShiftDefaultArgs>()({
    include: { type: true }
});

export type ShiftWithType = Prisma.ShiftGetPayload<typeof shiftWithType>;


const userWithAuthUser = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: { auth_user: true }
});

export type UserWithAuthUser = Prisma.UserGetPayload<typeof userWithAuthUser>;

const constraintWithMembers = Prisma.validator<Prisma.SessionConstraintDefaultArgs>()({
    include: {
        members: {
            include: {
                member: {
                    include: {
                        user: true
                    }
                }
            }
        },
        shift_type: true
    }
});

export type ConstraintWithMembers = Prisma.SessionConstraintGetPayload<typeof constraintWithMembers>;

const memberWithUser = Prisma.validator<Prisma.GroupMemberDefaultArgs>()({
    include: { user: true }
});

export type GroupMemberWithUser = Prisma.GroupMemberGetPayload<typeof memberWithUser>;