import { superValidate } from "sveltekit-superforms/client";
import type { PageServerLoad } from "./$types";
import { emailUserSignupSchema } from "$lib/forms";
import { fail, type Actions, redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { db } from "$lib/server/db";


export const load: PageServerLoad = async ({ }) => {
    const form = await superValidate(emailUserSignupSchema);
    return { form };
}

export const actions: Actions = {
    default: async ({request, locals}) => {
        const form = await superValidate(request, emailUserSignupSchema);
        console.log("POST", form);

        if (!form.valid)
            return fail(400, {form});

        const {email, password, name} = form.data;

        try {
            const authUser = await auth.createUser({
				key: {
					providerId: "email", // auth method
					providerUserId: email, // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					email
				}
			});
            const user = await db.user.create({
                data: {
                    id: authUser.userId,
                    name
                }
            });
			const session = await auth.createSession({
				userId: authUser.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			// this part depends on the database you're using
			// check for unique constraint error in user table
			if (
				e instanceof PrismaClientKnownRequestError
			) {
				return fail(400, {
					message: "Email already taken"
				});
			}
			return fail(500, {
				message: "An unknown error occurred"
			});
		}

        throw redirect(302, "/dashboard");
    }
}