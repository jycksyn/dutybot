import { newSessionSchema } from "$lib/forms";
import { db } from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/client";
import type { Actions, PageServerLoad } from "./$types";
import dayjs from "$lib/dates";
import utc from "dayjs/plugin/utc";

export const load: PageServerLoad = async ({locals, params}) => {
    const session = await locals.auth.validate();

    const user_id = session?.user.userId;

    if (!user_id) throw redirect(302, '/auth/login');

    const sessions = await db.session.findMany({
        where: {
            group_id: params.group_id
        }
    });
    
    const sessionForm = await superValidate(newSessionSchema);
    return { sessionForm, sessions };
}

export const actions: Actions = {
    newsession: async ({locals, request, params}) => {

        const formm = await request.formData();
        console.log(...formm.entries())

        const authSession = await locals.auth.validate();
    
        const user_id = authSession?.user.userId;
    
        if (!user_id)
            throw redirect(302, '/auth/login');

        const form = await superValidate(formm, newSessionSchema);
        console.log("POST", form);

        if (!form.valid)
            return fail(400, {sessionForm: form});

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

        const {start, end} = form.data;

        const {timezone} = member.group;
        
        try {
            var session = await db.session.create({
                data: {
                    group_id: member.group.id,
                    start: dayjs.tz(start, timezone).hour(0).minute(0).toDate(),
                    end: dayjs.tz(end, timezone).hour(0).minute(0).toDate(),
                },
            });
        } catch (e) {
            console.error(e);
            return message(form, "Internal Server Error", {
                status: 500
            });
        }

        throw redirect(303, '/dashboard/session/'+session.id);
    }
}