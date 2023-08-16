import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({locals}) => {
    const session = await locals.auth.validate();
    console.log({session})
    if (session) throw redirect(303, '/dashboard/session');
};