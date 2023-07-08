import { z } from "zod";

export const userInfoSchema = z.object({
    name: z.string().min(1),
    email: z.string().email()
});

export const rolesSchema = z.enum(['admin', 'respondent', 'owner']);

export const memberSchema = z.object({
    name: z.string().optional().nullable(),
    email: z.string().email(),
    user_id: z.string(),
    is_admin: z.boolean(),
    is_respondent: z.boolean()
});

export const membersSchema = memberSchema
    .array()
    .min(1)
    .refine(
        d => d.reduce((p, c) => +c?.is_admin + p, 0) >= 1,
        "Group must have an admin"
    )
    .refine(
        d => d.reduce((p, c) => +c?.is_respondent + p, 0) >= 1,
        "Group must have at least one respondent"
    );

export const groupSchema = z.object({
    name: z.string().min(1),
    emoji: z.string().emoji(),
    members: membersSchema
});

export const searchUsersSchema = z.object({
    email: z.string().email()
})