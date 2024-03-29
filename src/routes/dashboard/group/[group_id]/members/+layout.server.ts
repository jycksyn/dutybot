import { membersUpdateSchema, searchUsersSchema } from "$lib/forms";
import { db } from "$lib/server/db";
import { error, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/client";
import type { LayoutServerLoad } from "./$types";


export const load: LayoutServerLoad = async ({ url, locals, params }) => {
    const session = await locals.auth.validate();

    const user_id = session?.user.userId;

    if (!user_id) throw redirect(302, '/auth/login');

    const members = await db.groupMember.findMany({
        where: {
            group_id: params.group_id
        },
        include: {
            user: {
                include: {
                    auth_user: true
                }
            }
        }
    });

    const user = members.find(m => m.user_id == user_id)?.user;
    
    if (!user) throw error(403);

    const originalMembers = {
        members: members.map(m => ({
            user_id: m.user.id,
            name: m.user.name,
            email: m.user.auth_user.email ?? '',
            is_admin: m.is_admin,
            is_respondent: m.is_respondent
        }))
    };

    const groupForm = await superValidate(originalMembers, membersUpdateSchema);
    const userSearchForm = await superValidate(searchUsersSchema);

    return { groupForm, userSearchForm, originalMembers, user };
}