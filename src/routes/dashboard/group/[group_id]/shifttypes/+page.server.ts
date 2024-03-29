import { newSessionSchema, shiftTypeSchema } from "$lib/forms";
import { db } from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/client";
import type { Actions, PageServerLoad } from "./$types";
import { Repeat } from "@prisma/client";
import dayjs from "$lib/dates";

export const load: PageServerLoad = async ({locals, params}) => {
    const authSession = await locals.auth.validate();

    const user_id = authSession?.user.userId;

    if (!user_id) throw redirect(302, '/auth/login');

    const types = await db.shiftType.findMany({
        where: {
            group_id: params.group_id
        }
    });
    
    const shiftTypeForm = await superValidate(shiftTypeSchema);
    return { shiftTypeForm, types };
}

export const actions: Actions = {
    newshifttype: async ({locals, request, params}) => {

        const authSession = await locals.auth.validate();
    
        const user_id = authSession?.user.userId;
    
        if (!user_id)
            throw redirect(302, '/auth/login');

        const form = await superValidate(request, shiftTypeSchema);
        console.log("POST", form);

        if (!form.valid)
            return fail(400, {form});

        const member = await db.groupMember.findFirst({
            where: {
                user_id,
                group_id: params.group_id,
                is_admin: true
            },
            include: {
                group: true
            }
        });

        if (!member)
            throw redirect(302, '/dashboard/group');

        const {
            start_date, 
            end_date,
            name,
            start_time,
            end_time,
            repeat,
            repeat_days,
            timezone
        } = form.data;

        const days = (repeat_days?.length && repeat == Repeat.WEEKLY) ? (
            repeat_days.map(weekday => ({weekday}))
        ) : [];
        
        try {
            var type = await db.shiftType.create({
                data: {
                    group_id: member.group.id,
                    start_time: dayjs.utc(start_time, "HH:mm").toDate(),
                    end_time: dayjs.utc(end_time, "HH:mm").toDate(),
                    name,
                    repeat,
                    start_date: start_date ? dayjs.tz(start_date, member.group.timezone).toDate() : undefined,
                    end_date: end_date ? dayjs.tz(end_date, member.group.timezone).toDate() : undefined,
                    repeat_days: {
                        create: days
                    }
                },
            });
        } catch (e) {
            console.error(e);
            return message(form, "Internal Server Error", {
                status: 500
            });
        }

        return {form};
    }
}