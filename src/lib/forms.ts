import { Repeat } from "@prisma/client";
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
    members: membersSchema,
    timezone: z.string()
});

export const membersUpdateSchema = z.object({
    members: membersSchema
});

export const searchUsersSchema = z.object({
    email: z.string().email()
})

export const newSessionSchema = z.object({
    start: z.coerce.date(),
    end: z.coerce.date(),
}).refine(({start, end}) => {
    console.log(end.getTime(), start.getTime())
    return end.getTime() > start.getTime()
}, "End must be after start");

export const timeStringSchema = z.string().regex(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/);

export const shiftTypeSchema = z.object({
    name: z.string(),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
    start_time: timeStringSchema,
    end_time: timeStringSchema,
    timezone: z.string(),
    repeat: z.nativeEnum(Repeat),
    repeat_days: z.array(
        z.number().min(0).max(6)
    ).refine(s => new Set(s).size == s.length).optional()
}).refine(({repeat, repeat_days}) => (
    (repeat != Repeat.WEEKLY) || ((repeat_days?.length ?? 0) > 0)
), "Select at least one day to repeat weekly");

export const dueDateSchema = z.object({
    dueDate: z.coerce.date().nullable(),
    openForResponses: z.boolean()
});