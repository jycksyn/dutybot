import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals}) => {
    const {session} = await locals.auth.validateUser();
    console.log({session})
    if (session) throw redirect(303, '/dashboard/session');
};