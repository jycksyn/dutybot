import { selectShiftTypesSchema } from "$lib/selectShiftTypes";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/client";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { generateShifts } from "$lib/server/shifts";
import dayjs from "$lib/dates";
import { dueDateSchema } from "$lib/forms";

export const load: PageServerLoad = async ({parent, params}) => {
    const {is_admin, session: {dueDate, openForResponses}} = await parent();
    if(!is_admin) {
        throw redirect(303, `/dashboard/session/${params.session_id}/calendar`)
    }

    const dueDateForm = await superValidate({ dueDate, openForResponses }, dueDateSchema);

    return {dueDateForm};
}

export const actions: Actions = {
    updateSessionSettings: async ({ request, params, locals }) => {

        const { user: authUser } = await locals.auth.validateUser();
    
        const user_id = authUser?.userId;
        const session_id = params.session_id!!;
    
        if (!user_id)
            throw redirect(302, '/auth/login');
    
        const form = await superValidate(request, dueDateSchema);
        console.log("POST", form);
    
        if (!form.valid)
            return fail(400, { form });
    
        let session = await db.session.findUnique({
            where: {
                id: session_id
            },
            include: {
                group: {
                    include: {
                        members: true
                    }
                },
                shift_types: {
                    include: {
                        repeat_days: true
                    }
                },
            }
        });
    
        const is_admin = !!session?.group.members.find(m => m.is_admin && m.user_id == user_id);
    
        if (!session || !is_admin)
            throw redirect(302, '/dashboard/group');
    
        const { dueDate, openForResponses } = form.data;
    
        try {
            session = await db.session.update({
                where: {
                    id: session_id
                },
                data: {
                    dueDate,
                    openForResponses
                },
                include: {
                    group: {
                        include: {
                            members: true
                        }
                    },
                    shift_types: {
                        include: {
                            repeat_days: true
                        }
                    }
                }
            });
        } catch (e) {
            console.error(e);
            return message(form, "Internal Server Error", {
                status: 500
            });
        }
    }
}