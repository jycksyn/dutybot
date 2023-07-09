import { error, fail, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load: LayoutServerLoad = async ({ locals, params }) => {
    const { user: authUser } = await locals.auth.validateUser();

    if (!authUser?.userId) throw redirect(303, '/auth/login');

    const { group_id } = params;

    const [group, user] = await Promise.all([
        db.group.findUnique({
            where: { id: group_id },
            include: { members: true }
        }),
        db.user.findUnique({
            where: { id: authUser.userId }
        })
    ]).catch((e) => {
        console.error(e);
        throw error(501, e instanceof Error ? e.message : "Internal Error");
    });

    if (!group) throw error(404);
    if (!user) {
        const params = new URLSearchParams({
            redirect: `/group/${group_id}`
        });
        throw redirect(303, '/auth/completeprofile?' + params);
    }

    if (!group?.members.some(m => m.user_id = user.id))
        throw error(404);

    return {user, group};
};