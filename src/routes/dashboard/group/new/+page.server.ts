import { groupSchema, searchUsersSchema } from "$lib/forms";
import usersearch from "$lib/usersearch";
import { redirect, type Actions, fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import type { User } from "@prisma/client";

export const load: PageServerLoad = async ({ url, locals }) => {
    const authSession = await locals.auth.validate();

    const user_id = authSession?.user.userId;

    if (!user_id) throw redirect(302, '/auth/login');

    const user = await db.user.findUnique({ 
        where: {id: user_id},
        include: {auth_user: true}
    });

    if (!user || !user.name || !user.auth_user.email) throw redirect(302, '/auth/completeprofile');

    const groupForm = await superValidate({
        members: [{
            name: user.name,
            email: user.auth_user.email,
            user_id: user_id,
            is_admin: true,
            is_respondent: false
        }]
    }, groupSchema);
    const userSearchForm = await superValidate(searchUsersSchema);

    return { groupForm, userSearchForm, user };
}

export const actions: Actions = {
    usersearch,
    newgroup: async ({locals, request}) => {
        const authSession = await locals.auth.validate();
    
        const user_id = authSession?.user.userId;
    
        if (!user_id) throw redirect(302, '/auth/login');

        const form = await superValidate(request, groupSchema);
        console.log("POST", form);

        if (!form.valid)
            return fail(400, {form});

        const {name, emoji, members, timezone} = form.data;
        
        try {
            var group = await db.group.create({
                data: {
                    timezone,
                    name, emoji,
                    members: {
                        create: members.map(({user_id, is_admin, is_respondent}) => ({
                            user_id,
                            is_admin,
                            is_respondent
                        }))
                    }
                }
            });
        } catch (e) {
            console.error(e);
            return message(form, "Internal Server Error", {
                status: 500
            });
        }

        throw redirect(303, '/dashboard/group/'+group.id);

    }
}