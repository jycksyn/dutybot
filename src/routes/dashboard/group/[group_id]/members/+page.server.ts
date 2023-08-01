import { redirect, type Actions, error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import type { User } from "@prisma/client";
import { superValidate } from "sveltekit-superforms/client";
import { membersUpdateSchema, searchUsersSchema } from "$lib/forms";
import usersearch from "$lib/usersearch";


export const load: PageServerLoad = async ({ url, locals, params }) => {
    const {user: authUser} = await locals.auth.validateUser();

    const user_id = authUser?.userId;

    if (!user_id) throw redirect(302, '/auth/login');

    const members = await db.groupMember.findMany({
        where: {
            group_id: params.group_id
        },
        include: {
            user: true
        }
    });

    const user = members.find(m => m.user_id == user_id)?.user;
    
    if (!user) throw error(403);

    const groupForm = await superValidate({
        members: members.map(m => ({
            user_id: m.user.id,
            name: m.user.name,
            email: m.user.email ?? '',
            is_admin: m.is_admin,
            is_respondent: m.is_respondent
        }))
    }, membersUpdateSchema);
    const userSearchForm = await superValidate(searchUsersSchema);

    return { groupForm, userSearchForm, user };
}

export const actions: Actions = {
    usersearch
}