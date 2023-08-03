import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({parent}) => {
    const {is_admin} = await parent();
    if (!is_admin) throw redirect(303, './');
};