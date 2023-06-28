import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({locals}) => {
    const {session} = await locals.auth.validateUser();
    if (session) throw redirect(301, '/dashboard/session');
};