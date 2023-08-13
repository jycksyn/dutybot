import { error, fail, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load: LayoutServerLoad = async ({ locals, params }) => {
    const authSession = await locals.auth.validate();

    const user_id = authSession?.user.userId;

    if (!user_id) throw redirect(302, '/auth/login');

    const { group_id } = params;

    const member = await db.groupMember.findUnique({
        where: {
            group_id_user_id: {
                group_id,
                user_id
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