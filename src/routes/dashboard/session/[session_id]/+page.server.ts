import { selectShiftTypesSchema } from "$lib/selectShiftTypes";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/client";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { generateShifts } from "$lib/shifts";
import dayjs from "$lib/dates";

export const load: PageServerLoad = async ({parent}) => {
    const {session} = await parent();
    const selectShiftTypesForm = await superValidate({
        types: session.shift_types.map(x => x.id)
    }, selectShiftTypesSchema);

    return {selectShiftTypesForm};
}

export const actions: Actions = {
    selectShiftTypes: async ({ request, params, locals }) => {

        const { user: authUser } = await locals.auth.validateUser();
    
        const user_id = authUser?.userId;
        const session_id = params.session_id!!;
    
        if (!user_id)
            throw redirect(302, '/auth/login');
    
        const form = await superValidate(request, selectShiftTypesSchema);
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
    
        const { types } = form.data;
    
        try {
            session = await db.session.update({
                where: {
                    id: session_id
                },
                data: {
                    shift_types: {
                        set: types.map(id => ({
                            id
                        }))
                    }
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
    
        const shifts = generateShifts(
            dayjs(session.start),
            dayjs(session.end),
            session.shift_types
        )
    
        if (!session) return message(form, "Internal Server Error", {
            status: 500
        });
    
        try {
            await db.shift.deleteMany({
                where: {
                    session_id: session.id,
                }
            });
            await db.shift.createMany({
                data: shifts.map(s => ({...s, session_id }))
            });
        } catch (e) {
            console.error(e);
            return message(form, "Internal Server Error", {
                status: 500
            });
        }
    }
}