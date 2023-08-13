import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ url, locals }) => {
    const session = await locals.auth.validate();

    const user_id = session?.user.userId;

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