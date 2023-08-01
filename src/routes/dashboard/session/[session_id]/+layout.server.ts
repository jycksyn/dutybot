import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db";


export const load: LayoutServerLoad = async ({ locals, params }) => {

    const { user: authUser } = await locals.auth.validateUser();

    if (!authUser?.userId) throw redirect(303, '/auth/login');

    const { session_id } = params;

    const session = await db.session.findUnique({
        where: {
            id: session_id
        },
        include: {
            group: {
                include: {
                    members: {
                        where: {
                            user_id: authUser.userId
                        }
                    }
                }
            }
        }
    });

    if (!session) throw error(404);

    return {session};
};