import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { shiftRankingSchema } from "$lib/forms";
import { db } from "$lib/server/db";
import { superValidate } from "sveltekit-superforms/client";


export const load: PageServerLoad = async ({parent, params}) => {
    const {is_respondent, session, user_id} = await parent();
    if(!is_respondent) {
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
            preferences: preferences.reduce((prev, {shift_id, ranking}) => ({...prev, [shift_id]: ranking}), {})
        },
        shiftRankingSchema
    );

    return {shiftRankingForm};
}