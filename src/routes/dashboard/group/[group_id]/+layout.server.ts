import { error, fail, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load: LayoutServerLoad = async ({ locals, params }) => {

    const { user: authUser } = await locals.auth.validateUser();

    if (!authUser?.userId) throw redirect(303, '/auth/login');

    const { group_id } = params;

    const member = await db.groupMember.findUnique({
        where: {
            group_id_user_id: {
                group_id,
                user_id: authUser.userId
            }
        },
        include: {
            group: true,
            user: true
        }
    }).catch((e) => {
        console.error(e);
        throw error(501, e instanceof Error ? e.message : "Internal Error");
    });

    if (!member?.group) throw error(404);
    if (!member.user) {
        const params = new URLSearchParams({
            redirect: `/group/${group_id}`
        });
        throw redirect(303, '/auth/completeprofile?' + params);
    }

    return { ...member };
};