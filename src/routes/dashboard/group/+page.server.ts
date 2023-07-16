import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ url, locals }) => {
    const {user: authUser} = await locals.auth.validateUser();

    const user_id = authUser?.userId;

    if (!user_id) throw redirect(302, '/auth/login');

    const memberOf = await db.groupMember.findMany({
        where: {
            user_id
        },
        include: {
            group: true
        },
        orderBy: {
            group: {
                updatedAt: 'desc'
            }
        }
    })

    return {memberOf};
}