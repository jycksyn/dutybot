import { newSessionSchema, shiftTypeSchema } from "$lib/forms";
import { db } from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/client";
import type { Actions, PageServerLoad } from "./$types";
import { Repeat } from "@prisma/client";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export const load: PageServerLoad = async ({locals, params}) => {
    const {user: authUser} = await locals.auth.validateUser();

    const user_id = authUser?.userId;

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

        const {user: authUser} = await locals.auth.validateUser();
    
        const user_id = authUser?.userId;
    
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
                    start_date,
                    end_date,
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