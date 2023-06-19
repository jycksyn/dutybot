import { db } from "$lib/server/db";
import { googleAuth } from "$lib/server/google";
import { auth } from "$lib/server/lucia";
import type { User } from "@prisma/client";
import { redirect, resolvePath, type RequestHandler } from "@sveltejs/kit";
import type { User as LuciaUser } from "lucia-auth";
import { isNil, omitBy } from "lodash";

export const GET: RequestHandler = async ({ cookies, url, locals }) => {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const storedState = cookies.get("google_auth_state");

    if (!state || !storedState || state !== storedState) {
        throw new Response(null, { status: 401 });
    }

    try {
        var { existingUser, providerUser, createUser } = await googleAuth.validateCallback(code ?? "");

        var authUser: LuciaUser;
        var user: User | null = null;

        if (existingUser) {
            authUser = existingUser;

            user = await db.user.findUnique({
                where: {
                    id: authUser.userId
                }
            });
        } else {
            authUser = await createUser({
                email: providerUser.email
            });
        }

        const session = await auth.createSession(authUser.userId);
        locals.auth.setSession(session);
    } catch (e) {
        console.error(e);
        return new Response(null, {
            status: 500
        });
    }

    if (!user) {
        const params = new URLSearchParams(omitBy({
            name: providerUser.name,
            email: providerUser.email
        }, isNil) as Record<string, string>).toString();

        throw redirect(
            302,
            "/auth/completeprofile?"+params
        )
    }

    throw redirect(302, "/");

}