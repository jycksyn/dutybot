import { redirect, type Action, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { shiftRankingSchema } from "$lib/forms";
import { db } from "$lib/server/db";
import { message, superValidate } from "sveltekit-superforms/client";


export const load: PageServerLoad = async ({ parent, params }) => {
    const { is_respondent, session, user_id } = await parent();
    if (!is_respondent) {
        throw redirect(303, `/dashboard/session/${params.session_id}/calendar`)
    }

    const preferences = await db.preference.findMany({
        where: {
            response: {
                respondent_id: user_id,
                session_id: session.id,
                group_id: session.group_id
            }
        }
    });

    const shiftRankingForm = await superValidate(
        {
            preferences: preferences.reduce((prev, { shift_id, ranking }) => ({ ...prev, [shift_id]: ranking }), {})
        },
        shiftRankingSchema
    );

    return { shiftRankingForm };
}

export const actions: Actions = {
    submitpreferences: async ({ locals, params, request }) => {
        const authSession = await locals.auth.validate();
    
        const user_id = authSession?.user.userId;
        const { session_id } = params;

        if (!user_id)
            throw redirect(302, '/auth/login');
        if (!session_id)
            throw redirect(302, '/dashboard/session');

        const form = await superValidate(request, shiftRankingSchema);
        console.log("POST", form);

        if (!form.valid)
            return fail(400, { form });

        let session = await db.session.findFirst({
            where: {
                id: session_id
            },
            include: {
                shifts: true,
                group: {
                    include: {
                        members: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        const { preferences } = form.data;
        const sum = [...Object.values(preferences)].reduce((p,c) => p+c, 0);

        if (!session)
            throw redirect(302, '/dashboard/session');

        if (sum != (session?.shifts.length - 1) * session.shifts.length / 2)
            return message(form, "Please clear results and try again", {
                status: 400
            });

        if (!session_id || !session?.group.members.find(m => m.is_respondent && m.user_id == user_id))
            throw redirect(302, '/dashboard/session');

        try {
            await db.session.update({
                where: {
                    id: session_id,
                },
                data: {
                    responses: {
                        deleteMany: {
                            group_id: session.group_id,
                            respondent_id: user_id,
                        },
                        create: {
                            group_id: session.group_id,
                            respondent_id: user_id,
                            preferences: {
                                createMany: {
                                    data: [...Object.entries(preferences)].map(
                                        ([shift_id, ranking]) => ({
                                            shift_id, ranking
                                        })
                                    )
                                }
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.error(e);
            return message(form, "Internal Server Error", {
                status: 500
            });
        }

        return {form};
    }
}