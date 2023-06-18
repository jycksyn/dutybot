import { db } from "$lib/server/db";
import { googleAuth } from "$lib/server/google";
import { auth } from "$lib/server/lucia";
import type { User } from "@prisma/client";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import type { User as LuciaUser } from "lucia-auth";

export const GET: RequestHandler = async ({ cookies, url, locals }) => {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const storedState = cookies.get("google_auth_state");

    if (!state || !storedState || state !== storedState) {
        throw new Response(null, { status: 401 });
    }

    try {
        const { existingUser, providerUser, createUser } = await googleAuth.validateCallback(code ?? "");

        const getUser = async (): Promise<[User, LuciaUser]> => {
            if (existingUser) {
                let user = await db.user.findUnique({
                    where: {
                        auth_user_id: existingUser.userId
                    }
                });

                if (!user) {
                    user = await db.user.create({
                        data: {
                            auth_user_id: existingUser.userId,
                            email: providerUser.email
                        }
                    });
                }
                return [user, existingUser];
            };

            const authUser = await createUser({
                username: providerUser.email
            });

            const user = await db.user.create({
                data: {
                    auth_user_id: authUser.userId,
                    email: providerUser.email
                }
            });

            return [user, authUser];
        }

        const [user, authUser] = await getUser();
        const session = await auth.createSession(authUser.userId);
        locals.auth.setSession(session);
    } catch (e) {
        console.error(e);
        return new Response(null, {
            status: 500
        });
    }

    throw redirect(302, "/");

}