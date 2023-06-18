import { googleAuth } from "$lib/server/google";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({cookies}) => {
    const [url, state] = await googleAuth.getAuthorizationUrl();

    cookies.set("google_auth_state", state, {
        path: "/",
        maxAge: 60 * 60
    });

    return new Response(null, {
        status: 302,
        headers: {
            location: url.toString()
        }
    });
}