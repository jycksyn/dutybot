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
                        include: {
                            user: true
                        }
                    },
                    shiftTypes: true
                }
            },
            shift_types: true,
            shifts: {
                include: {
                    type: true
                }
            }
        }
    });

    if (!session) throw error(404);
    const currentMember = session.group.members.find(m => m.user_id == authUser.userId)
    if (!currentMember) throw error(404);

    return {session, ...currentMember};
};