import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({locals}) => {
    const authSession = await locals.auth.validate();
    console.log({authSession})
    if (!authSession) throw redirect(303, '/auth/login');
};