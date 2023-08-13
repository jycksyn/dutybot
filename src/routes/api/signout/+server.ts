import { auth } from "$lib/server/lucia";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({locals}) => {
    const session = await locals.auth.validate();
    if (!session) throw redirect(303, '/');

    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);

    throw redirect(303, '/');
}