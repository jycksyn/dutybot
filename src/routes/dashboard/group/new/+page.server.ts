import { groupSchema, searchUsersSchema } from "$lib/forms";
import usersearch from "$lib/usersearch";
import { redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import type { User } from "@prisma/client";

export const load: PageServerLoad = async ({ url, locals }) => {
    const {user: authUser} = await locals.auth.validateUser();

    const id = authUser?.userId;

    if (!id) throw redirect(302, '/auth/login');

    const user: User | null = await db.user.findUnique({ where: {id} });

    if (!user || !user.name || !user.email) throw redirect(302, '/auth/completeprofile');

    const groupForm = await superValidate({
        members: [{
            name: user.name,
            email: user.email,
            user_id: id,
            is_admin: true,
            is_respondent: false
        }]
    }, groupSchema);
    const userSearchForm = await superValidate(searchUsersSchema);

    return { groupForm, userSearchForm, user };
}

export const actions: Actions = {
    usersearch,
}