import { db } from "$lib/server/db";
import { googleAuth } from "$lib/server/google";
import { auth } from "$lib/server/lucia";
import type { User } from "@prisma/client";
import { redirect, resolvePath, type RequestHandler } from "@sveltejs/kit";
import type { User as LuciaUser } from "lucia";
import lodash from "lodash";
const { isNil, omitBy } = lodash;

export const GET: RequestHandler = async ({ cookies, url, locals }) => {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const storedState = cookies.get("google_auth_state");

    if (!state || !storedState || state !== storedState) {
        throw new Response(null, { status: 401 });
    }

    try {
        var { existingUser, googleUser, createUser } = await googleAuth.validateCallback(code ?? "");

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
                attributes: {
                    email: googleUser.email
                }
            });
        }

        const session = await auth.createSession({
            userId: authUser.userId,
            attributes: {}
        });
        locals.auth.setSession(session);
    } catch (e) {
        console.error(e);
        return new Response(null, {
            status: 500
        });
    }

    console.log({ user });

    if (!user) {
        console.log("no user");
        const params = new URLSearchParams(omitBy({
            name: googleUser.name,
            email: googleUser.email
        }, isNil) as Record<string, string>).toString();

        throw redirect(
            302,
            "/auth/completeprofile?" + params
        )
    }

    throw redirect(302, "/dashboard");

}