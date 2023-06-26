import { auth } from "$lib/server/lucia";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({locals}) => {
    const {session} = await locals.auth.validateUser();
    if (!session) throw redirect(301, '/');

    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);

    throw redirect(301, '/');
}